import { Resources } from "../../entity/Resources";
import { PlantResourceType } from "../../entity/Plant";
import { Game } from "../../entity/Game";
import { getOwnedPlantInstances } from "../utils/plantHelpers";
import { Player } from "../../entity/Player";

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
  const purchaseCopy = { ...purchase };

  return Object.keys(purchaseCopy)
    .reduce<number>((cost, resourceType) => {
      while (purchaseCopy[resourceType] > 0) {
        cost += getSingleResourceCost(marketCopy, resourceType);
        purchaseCopy[resourceType]--;
        marketCopy[resourceType]--;
      }
      
      return cost;
    }, 0)
};

export const getResourceCapacity = (game: Game, player: Player): Record<PlantResourceType, number> => {
  return getOwnedPlantInstances(game, player)
    .reduce((acc, plantInstance) => {
      const { resourceType, resourceBurn } = plantInstance.plant;
      acc[resourceType] += resourceBurn * 2;
      return acc;
    }, { COAL: 0, OIL: 0, TRASH: 0, URANIUM: 0, HYBRID: 0, WIND: 0 });
}

export const canFitResources = (game: Game, purchase: Resources): boolean => {
  const resourceCapacity = getResourceCapacity(game, game.activePlayer);
  
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
