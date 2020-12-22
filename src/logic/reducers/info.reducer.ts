import { createReducer } from "redux-act";
import { advancePhase, advanceTurn, setEra, setActionType, setActiveUser } from "../actions/info.actions";
import { Phase, Info, ActionType } from "../types/gameState";

const reducer = createReducer<Info>({}, null);

reducer.on(advanceTurn, (info) => ({
  ...info,
  turn: info.turn + 1
}));

reducer.on(setEra, (info, era) => ({
  ...info,
  era,
}));

reducer.on(advancePhase, (info) => {
  const phases: Phase[] = [Phase.PLANT, Phase.RESOURCE, Phase.CITY, Phase.POWER];
  const actionTypes: ActionType[] = [ActionType.PUT_UP_PLANT, ActionType.BUY_RESOURCES, ActionType.BUY_CITIES, ActionType.POWER_UP];
  const currentPhaseIdx = phases.indexOf(info.phase);
  const nextPhaseIdx = (currentPhaseIdx + 1) % phases.length;

  return {
    ...info,
    phase: phases[nextPhaseIdx],
    actionType: actionTypes[nextPhaseIdx],
  };
});

reducer.on(setActionType, (info, actionType) => ({
  ...info,
  actionType,
}));

reducer.on(setActiveUser, (info, activeUser) => ({
  ...info,
  activeUser,
}));

export default reducer;
