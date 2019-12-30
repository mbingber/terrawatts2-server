import { getRepository } from "typeorm";
import { Game, Phase, ActionType } from "../../entity/Game";
import { findGameById } from "../../queries/findGameById";
import { Resources } from "../../entity/Resources";
import { getTotalResourceCost, canFitResources } from "./resourceHelpers";
import { Player } from "../../entity/Player";

export const buyResources = async (
  gameId: number,
  meId: number,
  resources: Resources,
  cost: number
): Promise<Game> => {
  const gameRepository = getRepository(Game);
  const playerRepository = getRepository(Player);

  const game = await findGameById(gameId);
  
  if (!game) {
    throw new Error("ERROR: game not found");
  }

  if (meId !== game.activePlayer.id) {
    throw new Error("ERROR: not your turn");
  }

  if (game.phase !== Phase.RESOURCE) {
    throw new Error("ERROR: incorrect phase");
  }

  if (game.actionType !== ActionType.BUY_RESOURCES) {
    throw new Error("ERROR: incorrect actionType");
  }

  const areResourcesAvailable = Object.keys(resources)
    .every((resourceType) => resources[resourceType] <= game.resourceMarket[resourceType]);
  if (!areResourcesAvailable) {
    throw new Error("ERROR: resources unavailable");
  }

  if (game.activePlayer.money < cost) {
    throw new Error("ERROR: cannot afford resources");
  }

  if (getTotalResourceCost(game.resourceMarket, resources) !== cost) {
    throw new Error("ERROR: incorrect cost");
  }

  if (!canFitResources(game, resources)) {
    throw new Error("ERROR: cannot fit resources on plants");
  }

  // purchase the resources
  Object.keys(resources)
    .forEach((resourceType) => {
      game.resourceMarket[resourceType] -= resources[resourceType];
      game.activePlayer.resources += resources[resourceType];
    });

  game.activePlayer.money -= cost;
  await playerRepository.save(game.activePlayer);

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

  return gameRepository.save(game);
};
