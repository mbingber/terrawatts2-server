import { createAction } from "redux-act";
import { PlantPhaseEvent } from "../types/gameState";

export const recordPlantPhaseEvent = createAction<PlantPhaseEvent>('Record plant phase event');
export const clearPlantPhaseEvents = createAction('Clear plant phase events');
