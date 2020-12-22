import { Move } from '../../entity/Move';
import { GameState, ActionType } from '../types/gameState';
import { Context } from '../types/thunks';
import { Validator } from './validator';
import global from './global';
import putUpPlant from './putUpPlant';
import bidOnPlant from './bidOnPlant';
import discardPlant from './discardPlant';
import buyResources from './buyResources';
import buyCities from './buyCities';
import powerUp from './powerUp';

const actionTypeToValidators: Record<ActionType, Validator[]> = {
  [ActionType.PUT_UP_PLANT]: putUpPlant,
  [ActionType.BID_ON_PLANT]: bidOnPlant,
  [ActionType.DISCARD_PLANT]: discardPlant,
  [ActionType.BUY_RESOURCES]: buyResources,
  [ActionType.BUY_CITIES]: buyCities,
  [ActionType.POWER_UP]: powerUp,
};

export const validateMove = (move: Move, context: Context, state: GameState) => {
  const validations = [...global, ...actionTypeToValidators[move.actionType]];
  const failedValidation = validations.find(v => !v.validate(move, state, context));

  return {
    isValid: !failedValidation,
    message: failedValidation ? failedValidation.message : '',
  };
}

/**
 * validations:

 * DISCARD PLANT
 * need to provide hybrid ?
 *   provided, and it adds up, and i have enough :
 *   did not provide
 *
 * POWER UP
 * i have enough resources
 * need to provide hybrid ?
 *   provided, and it adds up :
 *   did not provide
 */