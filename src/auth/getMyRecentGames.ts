import { redis } from "../redis";
import { User } from "../entity/User";

export const RECENT_GAMES_SET = "RECENT_GAMES_SET";

export const getMyRecentGames = async (user: User) => {
  if (!user) {
    return [];
  }
  
  const now = Date.now();
  const dayAgo = now - 1000 * 60 * 60 * 24;
  const recentGamesJSON = await redis.zrevrangebyscore(RECENT_GAMES_SET, Infinity, dayAgo);
  const recentGames = recentGamesJSON.map((gameJSON) => JSON.parse(gameJSON));
  const myRecentGames = recentGames.filter((game) => game.players.includes(user.username));
  return myRecentGames;
}
