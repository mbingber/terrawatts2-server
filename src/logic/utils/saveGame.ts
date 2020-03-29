import { getRepository } from "typeorm";
import { Game } from "../../entity/Game";
import { PubSub } from "apollo-server";
import { findGameById } from "../../queries/findGameById";

export const GAME_UPDATED = "GAME_UPDATED";

export const saveGame = async (
  game: Game,
  pubsub: PubSub
): Promise<Game> => {
  const gameRepository = getRepository(Game);

  await gameRepository.save(game);

  const updatedGame = await findGameById(game.id);
  pubsub.publish(GAME_UPDATED, { gameUpdated: updatedGame });
  return updatedGame;
}
