import { createReducer } from "redux-act";
import { Resources } from "../types/gameState";
import { setResourceMarket, purchaseResourcesFromMarket } from "../actions/resourceMarket.actions";

const reducer = createReducer<Resources>({}, null);

reducer.on(setResourceMarket, (_, resourceMarket) => resourceMarket);

reducer.on(purchaseResourcesFromMarket, (resourceMarket, purchase) => ({
  coal: resourceMarket.coal - purchase.coal,
  oil: resourceMarket.oil - purchase.oil,
  trash: resourceMarket.trash - purchase.trash,
  uranium: resourceMarket.uranium - purchase.uranium,
}));

export default reducer;
