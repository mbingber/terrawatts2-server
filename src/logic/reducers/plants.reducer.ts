import { createReducer } from "redux-act";
import { PlantInfo } from "../types/gameState";
import { setPlantStatus } from "../actions/plants.actions";

const reducer = createReducer<Record<number, PlantInfo>>({}, null);

reducer.on(setPlantStatus, (plants, { plantId, status, owner = null }) => ({
  ...plants,
  [plantId]: { status, owner },
}));

export default reducer;
