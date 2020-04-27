import { Resources } from "../entity/Resources";
import { findGameById } from "../queries/findGameById";
import { getTotalResourceCost } from "./buyResources/resourceHelpers";
import { Game } from "../entity/Game";
import { getRepository } from "typeorm";

export const buyResourcesGod = async (
  gameId: number,
  playerId: number,
  resources: Resources
): Promise<Game> => {
  const gameRepository = getRepository(Game);
  const game = await findGameById(gameId);
  console.log(game.playerOrder, playerId);
  const player = game.playerOrder.find(player => {
    console.log("!!!!!", player.id, playerId)
    return player.id == playerId
  });
  console.log("PLAYER", player);

  const cost = getTotalResourceCost(game.resourceMarket, resources);
  player.money -= cost;

  Object.keys(resources).forEach(resource => {
    const amount = resources[resource];
    game.resourceMarket[resource] -= amount;
    player.resources[resource] += amount;
  });

  return gameRepository.save(game);
}