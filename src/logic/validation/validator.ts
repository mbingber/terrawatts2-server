import { GameState } from '../rootReducer';
import { Context } from '../types/thunks';
import { Move } from '../../entity/Move';

export type Validator = {
  validate: (move: Move, state: GameState, context: Context) => boolean;
  message: string;
};
