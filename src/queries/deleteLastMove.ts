import { GameState } from "../logic/types/gameState";
import { findGameById, getGameState } from "./findGameById";
import { getRepository } from "typeorm";
import { Move } from "../entity/Move";
import { pubsub } from "../pubsub";

// TODO: this is completely unauthenticated right now
export const deleteLastMove = async (gameId: number): Promise<GameState> => {
  const game = await findGameById(gameId);
  const moves = game.moves.filter(m => !m.isDeleted);
  if (moves.length > 0) {
    const lastMove = moves[moves.length - 1];
    lastMove.isDeleted = true;
    await getRepository(Move).save(lastMove);
  }

  const state = getGameState(game);
  await pubsub.publish(`STATE_UPDATED.${game.id}`, { gameStateUpdated: state });
  return state;
};
