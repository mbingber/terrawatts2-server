import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { createServer } from 'http';
import * as express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { importSchema } from 'graphql-import';
import * as jwt from 'jsonwebtoken';
import { createGame } from './logic/createGame/createGame';
import { findGameById } from './queries/findGameById';
import { getCityCostHelper } from './logic/buyCities/getCityCostHelper';
import { fetchMap } from './queries/fetchMap';
import { PlantStatus } from './entity/PlantInstance';
import { getRestockRates } from './logic/powerUp/restockRates';
import { cashMoney } from './logic/powerUp/makeMoney';
import { createUser } from './auth/createUser';
import { pubsub } from "./pubsub";
import { GAME_UPDATED } from './logic/utils/saveGame';
import { setPlayer } from './logic/setPlayer/setPlayer';
import { setEra } from './logic/setEra/setEra';
import { login } from './auth/login';
import { getCurrentUser } from './auth/getCurrentUser';
import { actionWrapper } from './logic/utils/actionWrapper';
import { ActionType, Game } from './entity/Game';
import { setPassword } from './auth/setPassword';
import { numCitiesToStartEra2, numCitiesToEndGame } from './logic/powerUp/cityMilestones';
import { setUserOnline, getOnlineUsernames } from './auth/onlineUsers';
import { getMyRecentGames } from './auth/getMyRecentGames';
import { buyResourcesGod } from './logic/buyResourcesGod';
import { setUserPreferences } from './auth/setUserPreferences';

const resolvers = {
  Query: {
    getGame: (_, { id }) => findGameById(id),
    getCityCostHelper: (_, { mapName, regions }) => getCityCostHelper(mapName, regions).then(JSON.stringify),
    fetchMap: (_, { mapName, regions }) => fetchMap(mapName, regions),
    getRevenues: () => cashMoney,
    getCurrentUser: (_, __, { user }) => getCurrentUser(user),
    getOnlineUsernames: () => getOnlineUsernames(),
    getMyRecentGames: (_, __, { user }) => getMyRecentGames(user)
  },
  Mutation: {
    createGame: (_, { usernames, mapName, name, regions }) => createGame(usernames, mapName, name, regions),
    putUpPlant: actionWrapper(ActionType.PUT_UP_PLANT),
    bidOnPlant: actionWrapper(ActionType.BID_ON_PLANT),
    discardPlant: actionWrapper(ActionType.DISCARD_PLANT),
    buyResources: actionWrapper(ActionType.BUY_RESOURCES),
    buyCities: actionWrapper(ActionType.BUY_CITIES),
    powerUp: actionWrapper(ActionType.POWER_UP),
    setPlayer: (_, { playerId, resources, money }) => setPlayer(+playerId, resources, money),
    setEra: (_, { gameId, era }) => setEra(+gameId, era),
    createUser: (_, { username, password, preferredColor, we }) => createUser(username, password, preferredColor, we),
    login: (_, { username, password }) => login(username, password),
    setPassword: (_, { username, password }) => setPassword(username, password),
    keepMeOnline: (_, __, { user }) => setUserOnline(user),
    buyResourcesGod: (_, { gameId, playerId, resources }) => buyResourcesGod(gameId, playerId, resources),
    setUserPreferences: (_, { preferredColor, we }, { user }) => setUserPreferences(user, preferredColor, we)
  },
  Subscription: {
    gameUpdated: {
      subscribe: (_, args) => pubsub.asyncIterator(`${GAME_UPDATED}.${args.id}`)
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
    plantMarket: ({ plants }) => plants
      .filter((plantInstance) => plantInstance.status === PlantStatus.MARKET)
      .sort((a, b) => a.plant.rank - b.plant.rank),
    deckCount: ({ plants }) => plants
      .filter((plantInstance) => plantInstance.status === PlantStatus.DECK)
      .length,
    possibleDeck: ({ plants, era, map }) => plants.filter(({ status, plant }) => {
      if (map.name === 'China') {
        return status === PlantStatus.DECK && plant.rank < 36;
      }
      
      if (status === PlantStatus.DECK) {
        return true;
      }

      if (status === PlantStatus.REMOVED_BEFORE_START) {
        return era < 3;
      }
    }).sort((a, b) => a.plant.rank - b.plant.rank),
    discardedPlants: ({ plants }) => plants
      .filter((plantInstance) => plantInstance.status === PlantStatus.DISCARDED)
      .sort((a, b) => a.plant.rank - b.plant.rank),
    era3Plants: ({ plants, turn, map }) => {
      if (map.name === 'China') {
        return plants.filter(p => p.status === PlantStatus.DECK && p.plant.rank >= 36);
      }
      
      const era3Plants = plants
        .filter((plantInstance) => plantInstance.status === PlantStatus.ERA_THREE)
        .sort((a, b) => a.plant.rank - b.plant.rank);

      if (era3Plants.length === 0 && turn > 1) {
        return plants
          .filter((plantInstance) => plantInstance.status === PlantStatus.DECK)
          .sort((a, b) => a.plant.rank - b.plant.rank);
      }
      return era3Plants;
    },
    restockRates: ({ playerOrder, map }) => getRestockRates(map.name, playerOrder.length),
    playerOrder: ({ plants, playerOrder }) => playerOrder.map((player) => ({
      ...player,
      ownedPlants: plants.filter((p) => p.status === PlantStatus.OWNED)
    })),
    era2Start: ({ playerOrder }) => numCitiesToStartEra2(playerOrder.length),
    gameEnd: ({ playerOrder }) => numCitiesToEndGame(playerOrder.length),
  },
  Player: {
    plants: (player) => player.ownedPlants
      .filter((plantInstance) => (
        plantInstance.player &&
        plantInstance.player.id === player.id
      ))
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
