import { createAction } from '@reduxjs/toolkit';
import { Thunk } from "../types/thunks";
import { selectMaxNumCities } from "../selectors/cities.selectors";
import { selectLowestPlantInMarket } from "../selectors/plants.selectors";
import { discardLowestPlant } from "./plants.actions";

export const occupyCity = createAction<{ cityId: string; me: string }>('Occupy city');

// if the max number of cities a player has exceeds the rank of a plant in the market, discard it
export const enforceCityPlantMarketRule = (): Thunk => (dispatch, getState, { game, plantList }) => {
  if (game.map.name === 'China') {
    return;
  }
  
  const maxNumCities = selectMaxNumCities(getState());
  const lowestPlant = selectLowestPlantInMarket(getState(), { plantList });

  if (lowestPlant && lowestPlant.rank <= maxNumCities) {
    dispatch(discardLowestPlant());
    dispatch(enforceCityPlantMarketRule());
  }
}
