import { Game } from "../../entity/Game";
import { getRepository } from "typeorm";

export const setEra = async(
  gameId: number,
  era: number
): Promise<Game> => {
  if (![1,2,3].includes(era)) {
    throw new Error("invalid era");
  }

  const gameRepository = getRepository(Game);

  const game = await gameRepository.findOne(gameId);

  if (!game) {
    throw new Error("game not found");
  }

  game.era = era;

  return gameRepository.save(game);
}