import { getRepository } from 'typeorm';
import { Map } from '../../entity/Map';
import { Game, Phase, ActionType } from '../../entity/Game';
import { createPlayers } from './createPlayers';
import { createPlantInstances } from './createPlantInstances';
import { getRegions } from './getRegions';
import { createCityInstances } from './createCityInstances';

export const createGame = async (
  usernames: string[],
  mapName: string
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

  game.regions = getRegions(mapName, usernames.length);
  game.cities = await createCityInstances(game.map, game.regions);
  game.plants = await createPlantInstances(usernames.length);

  game.turn = 1;
  game.era = 1;
  game.actionType = ActionType.PUT_UP_PLANT;
  game.phase = Phase.PLANT;
  game.resourceMarket = {
    coal: 24,
    oil: 18,
    trash: 6,
    uranium: 2
  };

  return gameRepository.save(game);
}
