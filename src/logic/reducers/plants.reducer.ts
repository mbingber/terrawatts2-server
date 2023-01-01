import { createReducer } from '@reduxjs/toolkit';
import { PlantInfo } from '../types/gameState';
import { setPlantStatus } from '../actions/plants.actions';

export default createReducer<Record<number, PlantInfo>>({}, builder => {
  builder
    .addCase(setPlantStatus, (state, action) => {
      const { plantId, status, owner = null } = action.payload;
      state[plantId] = { status, owner };
    });
});
