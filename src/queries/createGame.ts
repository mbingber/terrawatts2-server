import { getRepository } from 'typeorm';
import { Game } from '../entity/Game';
import { Map } from '../entity/Map';
import { getRegions } from '../logic/utils/getRegions';
import { User } from '../entity/User';
import { redis } from '../redis';
import { RECENT_GAMES_SET } from '../auth/getMyRecentGames';

export const createGame = async (
  usernames: string[],
  mapName: string,
  name: string,
  regions?: number[]
): Promise<Number> => {
  const userRepository = getRepository(User);
  const mapRepository = getRepository(Map);
  const gameRepository = getRepository(Game);

  if (usernames.length < 2 || usernames.length > 6) {
    throw new Error('ERROR: invalid number of players');
  }

  console.log("USERNAMES:", usernames);

  const users: User[] = await userRepository.find({
    where: usernames.map(u => ({ username: u }))
  });

  console.log("USERS:", users);

  if (users.length !== usernames.length) {
    throw new Error('ERROR: could not find all users');
  }
  
  const game = new Game();

  game.map = await mapRepository.findOne({
    where: { name: mapName },
  });

  if (!game.map) {
    throw new Error('ERROR: map not found');
  }

  game.regions = regions || getRegions(mapName, usernames.length);

  game.name = name || '';

  game.randomSeed = `${game.name || Date.now()}${usernames.join('')}`;

  game.users = users;

  const savedGame = await gameRepository.save(game);

  const now = Date.now();
  const dayAgo = now - 1000 * 60 * 60 * 24;
  await redis.zremrangebyscore(RECENT_GAMES_SET, -Infinity, dayAgo);
  await redis.zadd(RECENT_GAMES_SET, now.toString(), JSON.stringify({
    id: savedGame.id,
    name: savedGame.name,
    players: usernames
  }));

  return savedGame.id;
}
