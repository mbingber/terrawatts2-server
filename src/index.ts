import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { ApolloServer } from 'apollo-server';
import { importSchema } from 'graphql-import';
import { createGame } from './logic/createGame/createGame';
import { findGameById } from './queries/findGameById';
import { putUpPlant } from './logic/putUpPlant/putUpPlant';
import { bidOnPlant } from './logic/bidOnPlant/bidOnPlant';
import { getCityCostHelper } from './logic/buyCities/getCityCostHelper';
import { fetchMap } from './queries/fetchMap';

const resolvers = {
  Query: {
    getGame: (_, { id }) => findGameById(id),
    getCityCostHelper: (_, { mapName, regions }) => getCityCostHelper(mapName, regions).then(JSON.stringify),
    fetchMap: (_, { mapName, regions }) => fetchMap(mapName, regions)
  },
  Mutation: {
    createGame: (_, { usernames, mapName }) => createGame(usernames, mapName),
    putUpPlant: (_, { gameId, meId, plantInstanceId, bid }) => putUpPlant(+gameId, +meId, +plantInstanceId, +bid),
    bidOnPlant: (_, { gameId, meId, bid }) => bidOnPlant(+gameId, +meId, bid),
    buyResources: (_, { gameId }) => findGameById(gameId),
    buyCities: (_, { gameId }) => findGameById(gameId),
    powerUp: (_, { gameId }) => findGameById(gameId),
  },
  PopulatedMap: {
    connections: (map) => map.connections.filter(connection => (
      connection.cities.every(city => map.cities.some((c) => c.id === city.id))
    ))
  }
};

const server = new ApolloServer({
  typeDefs: importSchema('src/schema.graphql'),
  resolvers
});

createConnection().then(async connection => {
  server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
}).catch(error => console.log(error));
