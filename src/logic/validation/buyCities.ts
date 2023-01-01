import { Validator } from './validator';
import { selectMyMoney, selectMe } from '../selectors/players.selectors';
import { selectEra, selectCities } from '../selectors/info.selectors';
import { GameState } from '../rootReducer';
import { selectMyCities } from '../selectors/cities.selectors';
import { Context } from '../types/thunks';
import { Move } from '../../entity/Move';

export const cityCost = ({ cityIds }: Move, state: GameState, context: Context): number => {
  if (!cityIds) {
    return 0;
  }
  
  let remainingPurchaseIds = cityIds.slice();

  const network = selectMyCities(state).slice();

  let connectionCost = 0;
  while (remainingPurchaseIds.length > 0) {
    if (network.length === 0) {
      network.push(remainingPurchaseIds[0]);
      remainingPurchaseIds = remainingPurchaseIds.slice(1);
      continue;
    }

    let minPurchaseCost = Infinity;
    let cheapestPurchaseId = '';
    remainingPurchaseIds.forEach((purchaseId) => {
      const costsToNetwork = network.map((ownedId) => context.cityCostHelper[ownedId][purchaseId]);
      const cheapestPath = Math.min(...costsToNetwork);

      if (cheapestPath < minPurchaseCost) {
        minPurchaseCost = cheapestPath;
        cheapestPurchaseId = purchaseId;
      }
    });

    connectionCost += minPurchaseCost;
    network.push(cheapestPurchaseId);
    remainingPurchaseIds = remainingPurchaseIds.filter(id => id !== cheapestPurchaseId);
  }

  const cityToPlayers = selectCities(state);
  const occupancyCost = cityIds.reduce((acc, purchaseId) => {
    const numOccupants = (cityToPlayers[purchaseId] || []).length;
    return acc + 10 + 5 * numOccupants;
  }, 0);

  return connectionCost + occupancyCost;
}

const buyCitiesValidators: Validator[] = [
  {
    validate: (move, state) => (!!move.cost || move.cost === 0) && move.cost <= selectMyMoney(state),
    message: "You can't afford those cities"
  }, {
    validate: ({ cityIds }, state) => {
      if (!cityIds) {
        return false;
      }
      
      const era = selectEra(state);
      const cities = selectCities(state);
      return cityIds.every(cityId => {
        const occupiers = cities[cityId] || [];
        return occupiers.length < era;
      });
    },
    message: "One or more of those cities has no open slots"
  }, 
  {
    validate: ({ cityIds }, state) => {
      if (!cityIds) {
        return false;
      }

      const cities = selectCities(state);
      const me = selectMe(state);
      return cityIds.every(cityId => {
        const occupiers = cities[cityId] || [];
        return !occupiers.includes(me);
      });
    },
    message: "You are already in one or more of those cities"
  }, {
    validate: ({ cityIds }, _, context) => (cityIds || []).every(id => !!context.cityCostHelper[id]),
    message: "One or more of those cities is not in this game"
  }, {
    validate: (move, state, context) => cityCost(move, state, context) === move.cost,
    message: "Provided incorrect cost for cities"
  },
];

export default buyCitiesValidators;
