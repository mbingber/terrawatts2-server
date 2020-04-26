import { redis } from "../redis";
import { User } from "../entity/User";

const ONLINE_USERS_SET = "ONLINE_USERS_SET";

export const setUserOnline = async (user: User): Promise<User> => {
  if (!user) {
    return null;
  }
  
  const now = Date.now();
  const tenSecondsAgo = now - 10000;
  await redis.zremrangebyscore(ONLINE_USERS_SET, -Infinity, tenSecondsAgo);
  await redis.zadd(ONLINE_USERS_SET, now.toString(), user.username);

  return user;
}

export const getOnlineUsernames = async () => {
  const now = Date.now();
  const tenSecondsAgo = now - 10000;
  const usernames = await redis.zrevrangebyscore(ONLINE_USERS_SET, Infinity, tenSecondsAgo);
  return usernames.sort();
}
