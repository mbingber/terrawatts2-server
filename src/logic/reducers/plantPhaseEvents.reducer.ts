import { createReducer } from '@reduxjs/toolkit';
import { PlantPhaseEvent } from "../types/gameState";
import { recordPlantPhaseEvent, clearPlantPhaseEvents } from "../actions/plantPhaseEvents.actions";

export default createReducer<PlantPhaseEvent[]>([], builder => {
  builder
    .addCase(recordPlantPhaseEvent, (state, action) => {
      state.push(action.payload);
    })
    .addCase(clearPlantPhaseEvents, () => [])
});
