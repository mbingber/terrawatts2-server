import { createStore, AnyAction, Reducer, applyMiddleware, combineReducers, Store } from 'redux';
import { GameState } from "./types/gameState";
import thunk from 'redux-thunk';
import { getInitialState } from "./getInitialState";
import { makeMove } from "./actions/moves.actions";
import auction from './reducers/auction.reducer';
import cities from './reducers/cities.reducer';
import info from './reducers/info.reducer';
import plantPhaseEvents from './reducers/plantPhaseEvents.reducer';
import plants from './reducers/plants.reducer';
import playerOrder from './reducers/players.reducer';
import resourceMarket from './reducers/resourceMarket.reducer';
import { Context } from './types/thunks';
import { validateMove } from './validation';
import { Move } from '../entity/Move';

export const gameStateReducer: Reducer<GameState, AnyAction> = combineReducers({
  auction,
  cities,
  info,
  plantPhaseEvents,
  plants,
  playerOrder,
  resourceMarket
});

const executeMove = (move: Move, store) => {
  store.dispatch(makeMove(move));
};

export const getGenericStore = <T>(context: Context, reducer: Reducer<T, AnyAction>, getInitialState: (c: Context) => T): Store<T, AnyAction> => {
  const initialState = getInitialState(context);
  const store = createStore(reducer, initialState as any, applyMiddleware(thunk.withExtraArgument(context)));
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
