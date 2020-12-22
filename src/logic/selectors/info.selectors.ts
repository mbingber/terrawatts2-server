import { GameState } from "../types/gameState";

export const selectEra = (state: GameState) => state.info.era;
export const selectTurn = (state: GameState) => state.info.turn;
export const selectPhase = (state: GameState) => state.info.phase;
export const selectActionType = (state: GameState) => state.info.actionType;
export const selectActiveUser = (state: GameState) => state.info.activeUser;
export const selectPlantPhaseEvents = (state: GameState) => state.plantPhaseEvents;
export const selectAuction = (state: GameState) => state.auction;
export const selectPlants = (state: GameState) => state.plants;
export const selectCities = (state: GameState) => state.cities;
export const selectPlayerOrder = (state: GameState) => state.playerOrder;
export const selectResourceMarket = (state: GameState) => state.resourceMarket;
