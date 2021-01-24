import { createAction } from '@reduxjs/toolkit';
import { Resources, Player } from "../types/gameState";
import { Thunk } from "../types/thunks";
import { selectNewTurnOrder } from "../selectors/players.selectors";

export const addResourcesToPlayer = createAction<{ me: string; resources: Resources }>('Add resources to player');
export const setPlayerResources = createAction<{ me: string, resources: Resources }>('Set player resources');
export const makePlayerMoney = createAction<{ name: string; amount: number }>('Make player money');
export const chargePlayerMoney = ({ name, amount }: { name: string; amount: number }) => makePlayerMoney({ name, amount: -amount });
export const setPlayers = createAction<Player[]>('Set turn order');

export const setTurnOrder = (): Thunk => (dispatch, getState, { plantList }) => {
  const turnOrder = selectNewTurnOrder(getState(), { plantList });
  dispatch(setPlayers(turnOrder));
};

export const recordPlantSpend = createAction<{ me: string, amount: number }>('Record plant spend');
export const recordResourceSpend = createAction<{ me: string, amount: number }>('Record resource spend');
export const recordCitySpend = createAction<{ me: string, amount: number }>('Record city spend');
export const recordEarn = createAction<{ me: string, amount: number }>('Record earn');
