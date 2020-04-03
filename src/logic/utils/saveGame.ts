import { getRepository } from "typeorm";
import { Game } from "../../entity/Game";
import { redis } from "../../redis";

export const saveGame = async (
  game: Game
): Promise<Game> => {
  const gameRepository = getRepository(Game);
  game.version++;

  await gameRepository.save(game);

  redis.set(game.id, game);

  return game;
}
