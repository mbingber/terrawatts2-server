import Redis from "ioredis";

export const getNewRedis = () => process.env.REDIS_URL ? new Redis(process.env.REDIS_URL) : new Redis();

export const redis = getNewRedis();
