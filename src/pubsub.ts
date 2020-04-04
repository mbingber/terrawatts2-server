import { RedisPubSub } from "graphql-redis-subscriptions";
import { getNewRedis } from "./redis";

export const pubsub = new RedisPubSub({
  publisher: getNewRedis(),
  subscriber: getNewRedis()
});
