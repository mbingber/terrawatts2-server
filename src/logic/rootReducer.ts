import { combineReducers } from '@reduxjs/toolkit';
import auction from './reducers/auction.reducer';
import cities from './reducers/cities.reducer';
import info from './reducers/info.reducer';
import plantPhaseEvents from './reducers/plantPhaseEvents.reducer';
import plants from './reducers/plants.reducer';
import playerOrder from './reducers/players.reducer';
import resourceMarket from './reducers/resourceMarket.reducer';

export const gameStateReducer = combineReducers({
  auction,
  cities,
  info,
  plantPhaseEvents,
  plants,
  playerOrder,
  resourceMarket
});

export type GameState = ReturnType<typeof gameStateReducer>;