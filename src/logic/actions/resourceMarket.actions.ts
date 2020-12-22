import { createAction } from "redux-act";
import { Resources } from "../types/gameState";

export const setResourceMarket = createAction<Resources>('Restock resources');
export const purchaseResourcesFromMarket = createAction<Resources>('Purchase resources from market');
