import 'reflect-metadata';
import { createConnection } from 'typeorm';
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
import { ActionType } from './entity/Game';
import { setPassword } from './auth/setPassword';

const resolvers = {
  Query: {
    getGame: (_, { id }) => findGameById(id),
    getCityCostHelper: (_, { mapName, regions }) => getCityCostHelper(mapName, regions).then(JSON.stringify),
    fetchMap: (_, { mapName, regions }) => fetchMap(mapName, regions),
    getRevenues: () => cashMoney,
    getCurrentUser: (_, __, { user }) => getCurrentUser(user)
  },
  Mutation: {
    createGame: (_, { usernames, mapName }) => createGame(usernames, mapName),
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
    setPassword: (_, { username, password }) => setPassword(username, password)
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
    restockRates: ({ playerOrder, map }) => getRestockRates(map.name, playerOrder.length),
    playerOrder: ({ plants, playerOrder }) => playerOrder.map((player) => ({
      ...player,
      ownedPlants: plants.filter((p) => p.status === PlantStatus.OWNED)
    }))
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

createConnection().then(async connection => {
  app.listen({ port: process.env.PORT || 4000 }, () => {
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  });
}).catch(error => console.log(error));
