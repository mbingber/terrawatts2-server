import { createReducer } from '@reduxjs/toolkit';
import { Resources } from '../types/gameState';
import { setResourceMarket, purchaseResourcesFromMarket } from '../actions/resourceMarket.actions';

export default createReducer<Resources>(null, builder => {
  builder
    .addCase(setResourceMarket, (_, action) => action.payload)
    .addCase(purchaseResourcesFromMarket, (state, action) => {
      state.coal -= action.payload.coal;
      state.oil -= action.payload.oil;
      state.trash -= action.payload.trash;
      state.uranium -= action.payload.uranium;
    })
});
