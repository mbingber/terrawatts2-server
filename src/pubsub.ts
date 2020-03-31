import * as Redis from "ioredis";
import { RedisPubSub } from "graphql-redis-subscriptions";

export const pubsub = new RedisPubSub({
  publisher: process.env.REDIS_URL ? new Redis(process.env.REDIS_URL) : new Redis(),
  subscriber: process.env.REDIS_URL ? new Redis(process.env.REDIS_URL) : new Redis(),
});
