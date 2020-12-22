import { createReducer } from "redux-act";
import { occupyCity } from "../actions/cities.actions";

const reducer = createReducer<Record<string, string[]>>({}, null);

reducer.on(occupyCity, (cities, { cityId, me }) => ({
  ...cities,
  [cityId]: [...(cities[cityId] || []), me],
}));

export default reducer;
