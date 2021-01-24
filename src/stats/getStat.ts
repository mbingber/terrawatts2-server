// import { getStore, dispatchMove } from '../logic';
// import { AnyAction, Middleware } from '@reduxjs/toolkit';
// import { GameState } from '../logic/rootReducer';
// import { Context } from '../logic/types/thunks';

// export type StatReducer<S> = (
//   acc: S,
//   gameState: GameState,
//   action: AnyAction,
//   context: Context
// ) => S

// export const getStat = <S>(context: Context, reducer: StatReducer<S>, initial: S): S => {
//   let result = initial;
//   const middleware: Middleware = s => next => action => {
//     result = reducer(result, s.getState(), action, context);
//     next(action);
//   }
//   const store = getStore(context, [middleware])
//   context.game.moves.forEach(move => dispatchMove(move, store));
//   return result;
// };
