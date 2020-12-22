import { createReducer } from "redux-act";
import { PlantPhaseEvent } from "../types/gameState";
import { recordPlantPhaseEvent, clearPlantPhaseEvents } from "../actions/plantPhaseEvents.actions";

const reducer = createReducer<PlantPhaseEvent[]>({}, null);

reducer.on(recordPlantPhaseEvent, (events, event) => [...events, event]);
reducer.on(clearPlantPhaseEvents, () => []);

export default reducer;
