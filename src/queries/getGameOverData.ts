import { findGameById, getGameState, buildContext } from './findGameById';
import { GameOverPlayer, selectIsGameOver, selectGameOverPlayerData } from '../logic/selectors/end.selectors';

type GameOverData = {
  isOver: boolean;
  winOrder: GameOverPlayer[];
}

export const getGameOverData = async (id: number): Promise<GameOverData> => {
  const game = await findGameById(id);
  const context = await buildContext(game);
  const state = await getGameState(game);
  return {
    isOver: selectIsGameOver(state),
    winOrder: selectGameOverPlayerData(state, { plantList: context.plantList }),
  }
};
