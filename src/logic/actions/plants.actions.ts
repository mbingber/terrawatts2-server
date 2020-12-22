import { PlantStatus, ActionType, Phase } from "../types/gameState";
import { createAction } from "redux-act";
import { Thunk } from "../types/thunks";
import { chargePlayerMoney } from "./players.actions";
import { recordPlantPhaseEvent } from "./plantPhaseEvents.actions";
import { next } from "./next.actions";
import { setActionType, setActiveUser, setEra } from "./info.actions";
import { selectNumPlayers } from "../selectors/players.selectors";
import { selectMustDiscardPlant, selectDeck, selectLowestPlantInMarket, selectEra3Plants, selectChinaMiddlePlants, selectLowestPlantInDeck, selectPlantMarketLength, selectHighestPlantInMarket } from "../selectors/plants.selectors";
import { selectTurn, selectPlantPhaseEvents, selectEra, selectPhase } from "../selectors/info.selectors";
import { enforceCityPlantMarketRule } from "./cities.actions";
import { Plant } from "../../entity/Plant";

export const setPlantStatus = createAction<{ plantId: string, status: PlantStatus; owner?: string; }>('Set plant status');

export const discardLowestPlant = (suppressDraw = false): Thunk => (dispatch, getState, { plantList }) => {
  const lowestPlant = selectLowestPlantInMarket(getState(), { plantList });
  if (!lowestPlant) {
    return;
  }

  dispatch(setPlantStatus({ plantId: `${lowestPlant.id}`, status: PlantStatus.DISCARDED }));
  if (!suppressDraw) {
    dispatch(drawPlantFromDeck());
  }
};

export const moveHighestPlantToEra3 = (): Thunk => (dispatch, getState, { plantList }) => {
  const plant = selectHighestPlantInMarket(getState(), { plantList });
  dispatch(setPlantStatus({ plantId: `${plant.id}`, status: PlantStatus.ERA_THREE }));
  dispatch(drawPlantFromDeck());
}

export const startEra3 = (): Thunk => (dispatch, getState) => {
  const era3PlantIds = selectEra3Plants(getState());

  era3PlantIds.forEach(plantId => dispatch(setPlantStatus({ plantId, status: PlantStatus.DECK })));

  const phase = selectPhase(getState());
  if (phase === Phase.CITY || phase === Phase.POWER) {
    dispatch(discardLowestPlant(true));
  }
};

const drawRandomPlant = (plantIds: string[]): Thunk => (dispatch, _, { rand }) => {
  if (!plantIds.length) {
    return;
  }

  const randomIndex = Math.floor(rand() * plantIds.length);
  dispatch(setPlantStatus({ plantId: plantIds[randomIndex], status: PlantStatus.MARKET }));
};

const drawPlantFromDeck = (): Thunk => (dispatch, getState, { plantList, game }) => {
  if (game.map.name === 'China') {
    return dispatch(drawPlantChina());
  }
  
  const turn = selectTurn(getState());
  const plantPhaseEvents = selectPlantPhaseEvents(getState());

  if (turn === 1 && !plantPhaseEvents.length) {
    const thirteen = plantList.find(p => p.rank === 13) as Plant;
    dispatch(setPlantStatus({ plantId: `${thirteen.id}`, status: PlantStatus.MARKET }));
  } else {
    const deck = selectDeck(getState());
    const era = selectEra(getState());
    if (!deck.length && era < 3) {
      dispatch(startEra3());
    } else if (deck.length) {
      dispatch(drawRandomPlant(deck));
      dispatch(enforceCityPlantMarketRule());
    }
  }
};

export const obtainPlant = (plantId: string, bid: number, owner: string): Thunk => (dispatch, getState, { game }) => {
  dispatch(setPlantStatus({ plantId, status: PlantStatus.OWNED, owner }));

  dispatch(chargePlayerMoney({ name: owner, amount: bid }));

  if (game.map.name === 'China') {
    if (selectEra(getState()) === 3) {
      dispatch(setChinaEra3Market());
    }
  } else {
    dispatch(drawPlantFromDeck());
  }

  dispatch(recordPlantPhaseEvent({ plantId, cost: bid, username: owner }));

  const mustDiscard = selectMustDiscardPlant(getState(), { username: owner });
  if (mustDiscard) {
    dispatch(setActionType(ActionType.DISCARD_PLANT));
    dispatch(setActiveUser(owner));
  } else {
    dispatch(next());
  }
};

export const drawPlantChina = (): Thunk => (dispatch, getState, { plantList, rand }) => {
  const era = selectEra(getState());
  const deck = selectDeck(getState());
  const middlePlants = selectChinaMiddlePlants(getState(), { plantList });

  if (era === 3) {
    if (middlePlants.length) {
      return dispatch(drawRandomPlant(middlePlants));
    }
    return dispatch(drawRandomPlant(deck));
  }

  const lowestPlantInDeck = selectLowestPlantInDeck(getState(), { plantList });
  if (lowestPlantInDeck.rank < 31) {
    return dispatch(setPlantStatus({ plantId: `${lowestPlantInDeck.id}`, status: PlantStatus.MARKET }));
  }

  const chanceOfEra3 = 1 / (middlePlants.length + 1);
  if (era < 3 && rand() < chanceOfEra3) {
    dispatch(discardLowestPlant(true));
    dispatch(setEra(3));
    dispatch(setChinaEra3Market());
  }
  return dispatch(drawRandomPlant(middlePlants));
};

export const setChinaMarket = (): Thunk => (dispatch, getState) => {
  if (selectEra(getState()) === 3) {
    return dispatch(setChinaEra3Market());
  }

  const numPlayers = selectNumPlayers(getState());
  const targetMarketSize = Math.max(numPlayers - 1, 2);
  const minPlantsToAdd = Math.floor(numPlayers / 2);

  let plantsAdded = 0;
  while (plantsAdded < minPlantsToAdd || selectPlantMarketLength(getState()) < targetMarketSize) {
    dispatch(drawPlantChina());
    plantsAdded++;
    if (selectEra(getState()) === 3) {
      return;
    }
  }

  while (selectPlantMarketLength(getState()) > targetMarketSize) {
    dispatch(discardLowestPlant(true));
  }
};

export const setChinaEra3Market = (): Thunk => (dispatch, getState) => {
  while (selectPlantMarketLength(getState()) < 4 && selectDeck(getState()).length > 0) {
    dispatch(drawPlantChina());
  }
};
