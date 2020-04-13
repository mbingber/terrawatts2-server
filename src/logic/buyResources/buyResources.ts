import { Game, Phase, ActionType } from "../../entity/Game";
import { Resources } from "../../entity/Resources";
import { getTotalResourceCost, canFitResources } from "./resourceHelpers";
import { savePlayer } from "../utils/savePlayer";
import { Player } from "../../entity/Player";

interface BuyResourcesArgs {
  resources: Resources;
  cost: number;
}

export const buyResources = async (
  game: Game,
  me: Player,
  args: BuyResourcesArgs
): Promise<Game> => {
  const areResourcesAvailable = Object.keys(args.resources)
    .every((resourceType) => args.resources[resourceType] <= game.resourceMarket[resourceType]);
  if (!areResourcesAvailable) {
    throw new Error("ERROR: resources unavailable");
  }

  if (game.activePlayer.money < args.cost) {
    throw new Error("ERROR: cannot afford resources");
  }

  if (getTotalResourceCost(game.resourceMarket, args.resources) !== args.cost) {
    throw new Error("ERROR: incorrect cost");
  }

  if (!canFitResources(game, args.resources)) {
    throw new Error("ERROR: cannot fit resources on plants");
  }

  // purchase the resources
  Object.keys(args.resources)
    .forEach((resourceType) => {
      game.resourceMarket[resourceType] -= args.resources[resourceType];
      game.activePlayer.resources[resourceType] += args.resources[resourceType];
    });

  game.activePlayer.money -= args.cost;
  savePlayer(game.activePlayer, game);

  const activePlayerIdx = game.playerOrder.findIndex(player => player.id === game.activePlayer.id);
  if (activePlayerIdx === 0) {
    // start city phase
    game.phase = Phase.CITY;
    game.actionType = ActionType.BUY_CITIES;
    game.activePlayer = game.playerOrder[game.playerOrder.length - 1];
  } else {
    // advance to next player
    game.activePlayer = game.playerOrder[activePlayerIdx - 1];
  }

  return game;
};
