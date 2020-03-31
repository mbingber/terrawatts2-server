import { getRepository } from "typeorm";
import { Game } from "../../entity/Game";
import { findGameById } from "../../queries/findGameById";
import { pubsub } from "../../pubsub";

export const GAME_UPDATED = "GAME_UPDATED";

export const saveGame = async (
  game: Game
): Promise<Game> => {
  const gameRepository = getRepository(Game);

  await gameRepository.save(game);

  const updatedGame = await findGameById(game.id);
  pubsub.publish(`GAME_UPDATED.${game.id}`, { gameUpdated: updatedGame });
  return updatedGame;
}
