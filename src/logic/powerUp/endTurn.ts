import { Game, Phase, ActionType } from "../../entity/Game";
import { discardLowestPlant, moveHighestPlantToEra3, getMarketLength } from "../utils/plantHelpers";
import { getRestockRates } from "./restockRates";
import { Resources } from "../../entity/Resources";
import { getTurnOrder } from "../utils/getTurnOrder";
import { numCitiesToStartEra2 } from "./cityMilestones";
import { setChinaMarket } from "../utils/drawPlantChina";

export const endTurn = (game: Game): void => {
  const maxNumCities = game.playerOrder.reduce<number>((acc, player) => {
    const numCities = game
      .cities
      .filter((city) => city.players.some((p) => p.id === player.id))
      .length;

    return Math.max(acc, numCities);
  }, 0);

  if (maxNumCities >= numCitiesToStartEra2(game.playerOrder.length) && game.era === 1) {
    game.era = 2;
    discardLowestPlant(game);
  }

  // in china, market stuff happens before resource restock (matters for era 3 start)
  if (game.map.name === 'China') {
    if (game.era === 3) {
      discardLowestPlant(game);
    }
    
    setChinaMarket(game);
  }
  
  // restock resources
  const restockRates = getRestockRates(game.map.name, game.playerOrder.length)[`era${game.era}`];

  const resourcesHeld = game.playerOrder.reduce<Resources>((acc, player) => {
    Object.keys(player.resources)
      .forEach(r => {
        acc[r] += player.resources[r];
      })
    
    return acc;
  }, { coal: 0, oil: 0, trash: 0, uranium: 0 });

  Object.keys(restockRates).forEach((r) => {
    const total = r === "uranium" ? 12 : 24;
    const limit = total - resourcesHeld[r];

    game.resourceMarket[r] = Math.min(game.resourceMarket[r] + restockRates[r], limit);
  });

  if (game.map.name !== 'China') {
    // remove highest plant (or lowest plant if era3) and replace
    if (game.era === 3) {
      discardLowestPlant(game);
    } else if (game.map.name !== 'China' && getMarketLength(game) === 8) {
      moveHighestPlantToEra3(game);
    }

    // must recalc this, since moveHighestPlantToEra can change market length 
    if (getMarketLength(game) < 8) {
      game.era = 3;
    }
  }


  

  // redo turn order
  game.playerOrder = getTurnOrder(game);
  game.activePlayer = game.playerOrder[0];

  // start next turn
  game.turn++;
  game.phase = Phase.PLANT;
  game.actionType = ActionType.PUT_UP_PLANT;
  game.plantPhaseEvents = [];
}
