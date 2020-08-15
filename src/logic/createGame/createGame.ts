import { getRepository } from 'typeorm';
import { Map } from '../../entity/Map';
import { Game, Phase, ActionType } from '../../entity/Game';
import { createPlayers } from './createPlayers';
import { createPlantInstances } from './createPlantInstances';
import { getRegions } from './getRegions';
import { createCityInstances } from './createCityInstances';
import { redis } from '../../redis';
import { RECENT_GAMES_SET } from '../../auth/getMyRecentGames';
import { getStartingResourceMarket } from './getStartingResourceMarket';

export const createGame = async (
  usernames: string[],
  mapName: string,
  name: string,
  regions?: number[]
): Promise<Game> => {
  const mapRepository = getRepository(Map);
  const gameRepository = getRepository(Game);
  
  const game = new Game();
  
  game.playerOrder = await createPlayers(usernames);
  game.activePlayer = game.playerOrder[0];

  game.map = await mapRepository.findOne({
    where: { name: mapName },
    relations: ['cities']
  });

  if (!game.map) {
    throw new Error('ERROR: map not found');
  }

  game.regions = regions || getRegions(mapName, usernames.length);
  game.cities = await createCityInstances(game.map, game.regions);
  game.plants = await createPlantInstances(usernames.length, game.map.name, game.regions);

  game.turn = 1;
  game.era = 1;
  game.actionType = ActionType.PUT_UP_PLANT;
  game.phase = Phase.PLANT;

  game.resourceMarket = getStartingResourceMarket(game);

  game.name = name || "";

  const savedGame = await gameRepository.save(game);

  const now = Date.now();
  const dayAgo = now - 1000 * 60 * 60 * 24;
  await redis.zremrangebyscore(RECENT_GAMES_SET, -Infinity, dayAgo);
  await redis.zadd(RECENT_GAMES_SET, now.toString(), JSON.stringify({
    id: savedGame.id,
    name: savedGame.name,
    players: savedGame.playerOrder.map((p) => p.user.username)
  }));

  return savedGame;
}
