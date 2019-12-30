import { Resources } from "../../entity/Resources";
import { PlantResourceType } from "../../entity/Plant";
import { Game } from "../../entity/Game";
import { getOwnedPlantInstances } from "../utils/plantHelpers";

const getSingleResourceCost = (
  market: Resources,
  resourceType: string
): number => {
  const quantity = market[resourceType];
  
  if (resourceType === "uranium") {
    return quantity < 5 ? 18 - 2 * quantity : 13 - quantity;
  }

  return 8 - Math.floor((quantity - 1) / 3);
};

export const getTotalResourceCost = (market: Resources, purchase: Resources) => {
  const marketCopy = { ...market };

  return Object.keys(purchase)
    .reduce<number>((cost, resourceType) => {
      while (purchase[resourceType] > 0) {
        cost += getSingleResourceCost(marketCopy, resourceType);
        purchase[resourceType]--;
        marketCopy[resourceType]--;
      }
      
      return cost;
    }, 0)
};

export const canFitResources = (game: Game, purchase: Resources): boolean => {
  const resourceCapacity = getOwnedPlantInstances(game, game.activePlayer)
    .reduce((acc, plantInstance) => {
      const { resourceType, resourceBurn } = plantInstance.plant;
      acc[resourceType] = acc[resourceType] || 0;
      acc[resourceType] += resourceBurn * 2;
      return acc;
    }, {});
  
  const resourcesAfterPurchase = Object.keys(game.activePlayer.resources)
    .reduce<Resources>((acc, r) => {
      acc[r] = game.activePlayer.resources[r] + purchase[r];
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
}
