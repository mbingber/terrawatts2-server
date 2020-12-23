import { createReducer } from '@reduxjs/toolkit';
import { advancePhase, advanceTurn, setEra, setActionType, setActiveUser } from "../actions/info.actions";
import { Phase, Info, ActionType } from "../types/gameState";

export default createReducer<Info>(null, builder => {
  builder
    .addCase(advanceTurn, (state) => {
      state.turn++;
    })
    .addCase(setEra, (state, action) => {
      state.era = action.payload;
    })
    .addCase(advancePhase, (state) => {
      const phases: Phase[] = [Phase.PLANT, Phase.RESOURCE, Phase.CITY, Phase.POWER];
      const actionTypes: ActionType[] = [ActionType.PUT_UP_PLANT, ActionType.BUY_RESOURCES, ActionType.BUY_CITIES, ActionType.POWER_UP];
      const currentPhaseIdx = phases.indexOf(state.phase);
      const nextPhaseIdx = (currentPhaseIdx + 1) % phases.length;

      state.phase = phases[nextPhaseIdx];
      state.actionType = actionTypes[nextPhaseIdx];
    })
    .addCase(setActionType, (state, action) => {
      state.actionType = action.payload;
    })
    .addCase(setActiveUser, (state, action) => {
      state.activeUser = action.payload;
    });
});
