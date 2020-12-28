import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { createServer } from 'http';
import * as express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { importSchema } from 'graphql-import';
import * as jwt from 'jsonwebtoken';
import { findGameById, getGameState, resolveMove } from './queries/findGameById';
import { fetchMap } from './queries/fetchMap';
import { createUser } from './auth/createUser';
import { pubsub } from "./pubsub";
import { login } from './auth/login';
import { getCurrentUser } from './auth/getCurrentUser';
import { setPassword } from './auth/setPassword';
import { setUserOnline, getOnlineUsernames } from './auth/onlineUsers';
import { getMyRecentGames } from './auth/getMyRecentGames';
import { setUserPreferences } from './auth/setUserPreferences';
import { createGame } from './queries/createGame';
import { cashMoney } from './logic/utils/makeMoney';
import { ActionType } from './entity/Move';
import { getCityCostHelper } from './queries/getCityCostHelper';
import { deleteLastMove } from './queries/deleteLastMove';
import { getRestockRatesForAllEras } from './logic/utils/restockRates';
import { numCitiesToStartEra2, numCitiesToEndGame } from './logic/utils/cityMilestones';
import { fetchPlants } from './queries/fetchPlants';
import { PlantStatus, PlantInfo } from './logic/types/gameState';
import { GameState } from './logic/rootReducer';
import { selectIsGameOver } from './logic/selectors/end.selectors';
import { getGameOverData } from './queries/getGameOverData';

const takeAction = (actionType: ActionType) => (_, args, { user }) => resolveMove(args.gameId, user, { ...args, actionType })
const filterPlantStatus = (plants: Record<string, PlantInfo>, status: PlantStatus) => Object.keys(plants).filter(id => plants[id].status === status)

const resolvers = {
  Query: {
    getGame: (_, { id }) => findGameById(id),
    getGameOverData: (_, { id }) => getGameOverData(id),
    fetchMap: (_, { mapName, regions }) => fetchMap(mapName, regions),
    fetchPlants: () => fetchPlants(),
    getRevenues: () => cashMoney,
    getCurrentUser: (_, __, { user }) => getCurrentUser(user),
    getOnlineUsernames: () => getOnlineUsernames(),
    getMyRecentGames: (_, __, { user }) => getMyRecentGames(user)
  },
  Mutation: {
    createGame: (_, { usernames, mapName, name, regions }) => createGame(usernames, mapName, name, regions),
    putUpPlant: takeAction(ActionType.PUT_UP_PLANT),
    bidOnPlant: takeAction(ActionType.BID_ON_PLANT),
    discardPlant: takeAction(ActionType.DISCARD_PLANT),
    buyResources: takeAction(ActionType.BUY_RESOURCES),
    buyCities: takeAction(ActionType.BUY_CITIES),
    powerUp: takeAction(ActionType.POWER_UP),
    undo: (_, { gameId }) => deleteLastMove(gameId),
    createUser: (_, { username, password, preferredColor, we }) => createUser(username, password, preferredColor, we),
    login: (_, { username, password }) => login(username, password),
    setPassword: (_, { username, password }) => setPassword(username, password),
    keepMeOnline: (_, __, { user }) => setUserOnline(user),
    setUserPreferences: (_, { preferredColor, we }, { user }) => setUserPreferences(user, preferredColor, we)
  },
  Subscription: {
    gameStateUpdated: {
      subscribe: (_, args) => pubsub.asyncIterator(`STATE_UPDATED.${args.gameId}`)
    }
  },
  PopulatedMap: {
    connections: (map) => map.connections.filter(connection => (
      connection.cities.every(city => map.cities.some((c) => c.id === city.id))
    ))
  },
  City: {
    lat: ({ lat }) => lat || 0,
    lng: ({ lng }) => lng || 0,
  },
  Game: {
    map: ({ map, regions }) => fetchMap(map.name, regions),
    cityCostHelper: ({ map, regions }) => getCityCostHelper(map.name, regions).then(JSON.stringify),
    restockRates: ({ users, map }) => getRestockRatesForAllEras(map.name, users.length),
    era2Start: ({ users }) => numCitiesToStartEra2(users.length),
    gameEnd: ({ users }) => numCitiesToEndGame(users.length),
    state: (game) => getGameState(game),
  },
  GameState: {
    plantMarket: ({ plants }: GameState) => filterPlantStatus(plants, PlantStatus.MARKET),
    playerOrder: ({ playerOrder, plants, plantPhaseEvents, info: { actionType, activeUser } }: GameState) => {
      let discardEdgeCase = null;

      if (actionType === ActionType.DISCARD_PLANT) {
        const event = plantPhaseEvents.find(e => e.username === activeUser);
        if (event && event.plantId) {
          discardEdgeCase = event.plantId;
        }
      }
      
      return playerOrder.map(player => ({
        ...player,
        plantIds: Object.keys(plants)
          .filter(plantId => plants[plantId].owner === player.username)
          .filter(plantId => plantId !== discardEdgeCase)
      }));
    },
    deckCount: ({ plants }: GameState): number => filterPlantStatus(plants, PlantStatus.DECK).length,
    possibleDeck: ({ plants, info: { era } }: GameState) => Object.keys(plants).filter(id => {
      const { status } = plants[id];

      if (status === PlantStatus.REMOVED_BEFORE_START_FIXED) {
        // the plants removed in the China rules should not get sent because they are not random
        return false;
      }

      if (status === PlantStatus.DECK) {
        return true;
      }

      if (status === PlantStatus.REMOVED_BEFORE_START) {
        return era < 3;
      }
    }),
    discardedPlants: ({ plants }: GameState) => filterPlantStatus(plants, PlantStatus.DISCARDED),
    era3Plants: ({ plants }: GameState) => filterPlantStatus(plants, PlantStatus.ERA_THREE),
    cityList: ({ cities }: GameState) => Object.keys(cities).map(cityId => ({
      cityId,
      occupants: cities[cityId] || []
    })),
    isOver: (state: GameState) => selectIsGameOver(state)
  }
};

const getUser = (token: string): { id: number; username: string; } => {
  try {
    if (token) {
      return jwt.verify(token, process.env.LOGIN_SECRET);
    }
    return null;
  } catch (err) {
    return null;
  }
};

const server = new ApolloServer({
  typeDefs: importSchema('src/schema.graphql'),
  resolvers,
  playground: true,
  introspection: true,
  subscriptions: {
    keepAlive: 10000
  },
  context: ({ req }) => {
    if (!req) {
      return {};
    };
    
    const tokenWithBearer = req.headers.authorization || '';
    const token = tokenWithBearer.split(' ')[1];
    const user = getUser(token);

    return { user };
  }
});

const app = express();
server.applyMiddleware({
  app,
  cors: {
    credentials: true,
    origin: true,
  },
  path: '/'
});

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

createConnection().then(async connection => {
  httpServer.listen({ port: process.env.PORT || 4000 }, () => {
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
    console.log(`🚀 Subscriptions ready at ws://localhost:4000${server.subscriptionsPath}`);
  });
}).catch(error => console.log(error));
