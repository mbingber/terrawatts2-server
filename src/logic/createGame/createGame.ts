import { getRepository } from 'typeorm';
import { Map } from '../../entity/Map';
import { Game, Phase, ActionType } from '../../entity/Game';
import { createPlayers } from './createPlayers';
import { createPlantInstances } from './createPlantInstances';
import { getRegions } from './getRegions';
import { createCityInstances } from './createCityInstances';
import { redis } from '../../redis';
import { RECENT_GAMES_SET } from '../../auth/getMyRecentGames';

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
  game.plants = await createPlantInstances(usernames.length);

  game.turn = 1;
  game.era = 1;
  game.actionType = ActionType.PUT_UP_PLANT;
  game.phase = Phase.PLANT;

  if (game.map.name === 'Italy') {
    game.resourceMarket = {
      coal: 18,
      oil: 15,
      trash: 12,
      uranium: 2
    };
  } else {
    game.resourceMarket = {
      coal: 24,
      oil: 18,
      trash: 6,
      uranium: 2
    };
  }


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
