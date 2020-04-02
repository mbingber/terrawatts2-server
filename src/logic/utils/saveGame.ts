import { getRepository } from "typeorm";
import { Game } from "../../entity/Game";
import { pubsub } from "../../pubsub";

export const GAME_UPDATED = "GAME_UPDATED";

export const saveGame = async (
  game: Game
): Promise<Game> => {
  const gameRepository = getRepository(Game);
  game.lastUpdated = new Date();

  await gameRepository.save(game);

  pubsub.publish(`GAME_UPDATED.${game.id}`, { gameUpdated: game });
  return game;
}
