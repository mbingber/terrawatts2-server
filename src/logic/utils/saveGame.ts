import { getRepository } from "typeorm";
import { Game } from "../../entity/Game";
import { redis } from "../../redis";
import { pubsub } from "../../pubsub";
import { performance } from "perf_hooks";

export const GAME_UPDATED = "GAME_UPDATED";

export const saveGame = async (
  game: Game
): Promise<Game> => {
  const start = performance.now();
  const gameRepository = getRepository(Game);
  game.version++;

  await gameRepository.save(game);
  const gameIsSaved = performance.now();

  console.log("SAVE TIME:", gameIsSaved - start);

  // redis.set(game.id, JSON.stringify(game));

  pubsub.publish(`GAME_UPDATED.${game.id}`, { gameUpdated: game });
  return game;
}
