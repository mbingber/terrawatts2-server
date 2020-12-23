import { configureStore, getDefaultMiddleware, Reducer, AnyAction, Store } from '@reduxjs/toolkit';
import { getInitialState } from './getInitialState';
import { GameState, gameStateReducer } from './rootReducer';
import { makeMove } from './actions/moves.actions';
import { Context } from './types/thunks';
import { validateMove } from './validation';
import { Move } from '../entity/Move';

const executeMove = (move: Move, store) => {
  if (!move.isDeleted) {
    store.dispatch(makeMove(move));
  }
};

export const getGenericStore = <T>(
  context: Context,
  reducer: Reducer<T, AnyAction>,
  getInitialState: (c: Context) => T
): Store<T, AnyAction> => {
  const store = configureStore({
    reducer,
    preloadedState: getInitialState(context),
    middleware: getDefaultMiddleware({ thunk: { extraArgument: context } }),
  });
  context.game.moves.forEach(move => executeMove(move, store));
  return store;
};

export const getStore = (context: Context): Store<GameState, AnyAction> => {
  return getGenericStore(context, gameStateReducer, getInitialState);
};

export const attemptMove = (move: Move, context: Context) => {
  const store = getStore(context);
  const { isValid, message } = validateMove(move, context, store.getState());

  if (isValid) {
    executeMove(move, store);
  }

  return {
    isValid,
    message,
    state: store.getState(),
  };
};
