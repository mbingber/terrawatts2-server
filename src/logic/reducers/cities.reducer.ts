import { createReducer } from '@reduxjs/toolkit';
import { occupyCity } from "../actions/cities.actions";

export default createReducer<Record<string, string[]>>({}, builder => {
  builder
    .addCase(occupyCity, (state, action) => {
      const { cityId, me } = action.payload;
      state[cityId] = state[cityId] || [];
      state[cityId].push(me);
    });
});
