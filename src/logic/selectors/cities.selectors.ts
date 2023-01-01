import { createSelector } from '@reduxjs/toolkit';
import { selectPlayerOrder, selectCities } from './info.selectors';
import { selectMe } from './players.selectors';

export const selectMaxNumCities = createSelector(
  [selectPlayerOrder, selectCities],
  (players, cities) => {
    return players.reduce<number>((acc, { username }) => {
      const numCities = Object.values(cities)
        .filter(players => players.includes(username))
        .length;

      return Math.max(acc, numCities);
    }, 0);
  }
);

export const selectMyCities = createSelector(
  [selectMe, selectCities],
  (me, cities) => Object.keys(cities).filter(cityId => cities[cityId].includes(me))
);
