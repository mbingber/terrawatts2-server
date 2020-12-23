import { Validator } from './validator';
import { selectResourceMarket } from '../selectors/info.selectors';
import { GameState } from '../rootReducer';
import { ResourceType, Resources } from '../types/gameState';
import { selectMyMoney, selectMyResources } from '../selectors/players.selectors';
import { selectMyResourceCapacity } from '../selectors/plants.selectors';
import { Context } from '../types/thunks';
import { Move } from '../../entity/Move';
import { PlantResourceType } from '../../entity/Plant';

const getSingleResourceCost = (
  market: Resources,
  resourceType: ResourceType
): number => {
  const quantity = market[resourceType];
  
  if (resourceType === "uranium") {
    return quantity < 5 ? 18 - 2 * quantity : 13 - quantity;
  }

  return 8 - Math.floor((quantity - 1) / 3);
};

const getTotalResourceCost = (market: Resources, purchase: Resources) => {
  const marketCopy = { ...market };
  const purchaseCopy = { ...purchase };

  return Object.keys(purchaseCopy)
    .reduce<number>((cost, resourceType) => {
      const type = resourceType as ResourceType;
      
      while (purchaseCopy[type] > 0) {
        cost += getSingleResourceCost(marketCopy, type);
        purchaseCopy[type]--;
        marketCopy[type]--;
      }
      
      return cost;
    }, 0)
};

const canFitResources = (move: Move, state: GameState, context: Context): boolean => {
  const { resources: purchase } = move;
  if (!purchase) {
    return false;
  }
  
  const resourceCapacity = selectMyResourceCapacity(state, context);
  const myResources = selectMyResources(state);
  
  const resourcesAfterPurchase = Object.keys(myResources)
    .reduce<Resources>((acc, r) => {
      const type = r as ResourceType;
      acc[type] = myResources[type] + purchase[type];
      return acc;
    }, {} as Resources);

  for (const r in resourcesAfterPurchase) {
    if (r === "trash") {
      if (resourcesAfterPurchase.trash > resourceCapacity[PlantResourceType.TRASH]) {
        return false;
      }
    }

    if (r === "uranium") {
      if (resourcesAfterPurchase.uranium > resourceCapacity[PlantResourceType.URANIUM]) {
        return false;
      }
    }

    if (r === "coal" || r === "oil") {
      for (let i = 0; i < resourcesAfterPurchase[r]; i++) {
        const resourceType = r === "coal" ? PlantResourceType.COAL : PlantResourceType.OIL
        if (resourceCapacity[resourceType] > 0) {
          resourceCapacity[resourceType]--;
        } else if (resourceCapacity[PlantResourceType.HYBRID] > 0) {
          resourceCapacity[PlantResourceType.HYBRID]--;
        } else {
          return false;
        }
      }
    }
  }

  return true;
};

const buyResourcesValidators: Validator[] = [
  {
    validate: (move, state) => {
      const { resources } = move;
      if (!resources) {
        return false;
      }
      const market = selectResourceMarket(state);
      const types: ResourceType[] = ['coal', 'oil', 'trash', 'uranium']
      return types.every((type) => market[type] >= resources[type]);
    },
    message: "Not enough resources in market",
  }, {
    validate: (move, state) => (!!move.cost || move.cost === 0) && move.cost <= selectMyMoney(state) ,
    message: "You can't afford those resources",
  }, {
    validate: (move, state) => (
      (!!move.cost || move.cost === 0) &&
      !!move.resources &&
      getTotalResourceCost(selectResourceMarket(state), move.resources) === move.cost
    ),
    message: "Provided incorrect cost",
  }, {
    validate: canFitResources,
    message: "Your plants can't fit those resources",
  },
];

export default buyResourcesValidators;
