import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { ApolloServer, PubSub, withFilter } from 'apollo-server';
import { importSchema } from 'graphql-import';
import { createGame } from './logic/createGame/createGame';
import { findGameById } from './queries/findGameById';
import { putUpPlant } from './logic/putUpPlant/putUpPlant';
import { bidOnPlant } from './logic/bidOnPlant/bidOnPlant';
import { getCityCostHelper } from './logic/buyCities/getCityCostHelper';
import { fetchMap } from './queries/fetchMap';
import { PlantStatus } from './entity/PlantInstance';
import { GAME_UPDATED } from './logic/utils/saveGame';
import { buyResources } from './logic/buyResources/buyResources';
import { getRestockRates } from './logic/powerUp/restockRates';
import { buyCities } from './logic/buyCities/buyCities';
import { powerUp } from './logic/powerUp/powerUp';
import { cashMoney } from './logic/powerUp/makeMoney';
import { discardPlant } from './logic/discardPlant/discardPlant';

const pubsub = new PubSub();

console.log("does this code get run?");

const resolvers = {
  Query: {
    getGame: (_, { id }) => findGameById(id),
    getCityCostHelper: (_, { mapName, regions }) => getCityCostHelper(mapName, regions).then(JSON.stringify),
    fetchMap: (_, { mapName, regions }) => fetchMap(mapName, regions),
    getRevenues: () => cashMoney
  },
  Mutation: {
    createGame: (_, { usernames, mapName }) => createGame(usernames, mapName),
    putUpPlant: (_, { gameId, meId, plantInstanceId, bid }) => putUpPlant(+gameId, +meId, +plantInstanceId, +bid, pubsub),
    bidOnPlant: (_, { gameId, meId, bid }) => bidOnPlant(+gameId, +meId, bid, pubsub),
    discardPlant: (_, { gameId, meId, plantInstanceId, fossilFuelDiscard }) => discardPlant(+gameId, +meId, +plantInstanceId, fossilFuelDiscard, pubsub),
    buyResources: (_, { gameId, meId, resources, cost }) => buyResources(+gameId, +meId, resources, cost, pubsub),
    buyCities: (_, { gameId, meId, cityInstanceIds, cost }) => buyCities(+gameId, +meId, cityInstanceIds, cost, pubsub),
    powerUp: (_, { gameId, meId, plantInstanceIds, hybridChoice }) => powerUp(+gameId, +meId, plantInstanceIds, hybridChoice, pubsub),
  },
  Subscription: {
    gameUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([GAME_UPDATED]),
        (payload, variables) => {
          // intentional ==, here
          return payload.gameUpdated.id == variables.id
        }
      )
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
    restockRates: ({ playerOrder, map }) => getRestockRates(map.name, playerOrder.length)
  }
};

const server = new ApolloServer({
  typeDefs: importSchema('src/schema.graphql'),
  resolvers,
  playground: true
});

createConnection().then(async connection => {
  server.listen(process.env.PORT || 4000).then(({ url }) => console.log(`Server is running on ${url}`));
}).catch(error => console.log(error));
