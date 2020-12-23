import { createSelector } from '@reduxjs/toolkit';
import { selectPlantsOffProps, selectPlantIdsFromProps, selectHybridChoice, selectMapName } from "./props.selectors";
import { selectMyResources, selectMe, selectNumPlayers } from "./players.selectors";
import { ResourceType, Resources } from "../types/gameState";
import { selectCities, selectPlayerOrder, selectEra, selectResourceMarket } from "./info.selectors";
import { makeMoney } from "../utils/makeMoney";
import { getRestockRates } from "../utils/restockRates";
import { PlantResourceType } from "../../entity/Plant";

const selectPlantsPowering = createSelector(
  [selectPlantsOffProps, selectPlantIdsFromProps],
  (plantList, plantIds) => plantList.filter(plant => plantIds.includes('' + plant.id))
);

export const selectResourcesNeededToPower = createSelector(
  selectPlantsPowering,
  (plants) => plants
    .reduce<Partial<Record<PlantResourceType, number>>>((acc, plant) => {
      const { resourceType, resourceBurn } = plant;

      if (resourceType !== PlantResourceType.WIND) {
        acc[resourceType] = (acc[resourceType] || 0) + resourceBurn;
      }
      
      return acc;
    }, {})
);

export const selectHybridChoiceNeeded = createSelector(
  [selectResourcesNeededToPower, selectMyResources],
  (needed, { coal, oil }) => {
    const remaining = (coal - needed.COAL) + (oil - needed.OIL);
    return needed.HYBRID > 0 && remaining > needed.HYBRID;
  }
);

export const selectResourcesAfterPowering = createSelector(
  [selectMyResources, selectResourcesNeededToPower, selectHybridChoice],
  (myResources, resourcesNeeded, hybridChoice) => {
    const myResourcesCopy = { ...myResources };
    
    [
      PlantResourceType.COAL,
      PlantResourceType.OIL,
      PlantResourceType.TRASH,
      PlantResourceType.URANIUM,
      PlantResourceType.HYBRID
    ].forEach((r) => {
      const numResources = resourcesNeeded[r] || 0;
  
      if (numResources === 0) {
        return;
      }
      
      if (r === PlantResourceType.HYBRID) {
        const remainingFossilFuel = myResourcesCopy.coal + myResourcesCopy.oil;
        // TODO: validate carefully. hybridChoice must not be provided unnecessary
        if (hybridChoice) {
            myResourcesCopy.coal -= hybridChoice.coal;
            myResourcesCopy.oil -= hybridChoice.oil;
        } else if (remainingFossilFuel >= numResources) {
          // three ways choice can be unambiguous:
          if (myResourcesCopy.oil === 0) {
            // 1) Player only has coal
            myResourcesCopy.coal -= numResources;
          } else if (myResourcesCopy.coal === 0) {
            // 2) Player only has oil
            myResourcesCopy.oil -= numResources;
          } else {
            // 3) Exactly enough resources remain
            myResourcesCopy.coal = 0;
            myResourcesCopy.oil = 0;
          }
        }
      } else {
        const rLower = r.toLowerCase() as ResourceType;
        myResourcesCopy[rLower] -= numResources;
      }
    });

    return myResourcesCopy;
  }
);

const selectMyNumCities = createSelector(
  [selectMe, selectCities],
  (me, cities) => Object.values(cities).reduce((acc, players) => players.includes(me) ? acc + 1 : acc, 0)
);

const selectPowerCapacity = createSelector(
  selectPlantsPowering,
  plants => plants.reduce((acc, plant) => acc + plant.numCities, 0)
);

const selectNumCitiesPowering = createSelector(
  [selectMyNumCities, selectPowerCapacity],
  (numCities, capacity) => Math.min(numCities, capacity)
);

export const selectRevenue = createSelector(
  selectNumCitiesPowering,
  makeMoney
);

const selectTotalResourcesHeld = createSelector(
  selectPlayerOrder,
  (players) => players.reduce<Resources>((acc, player) => {
    return {
      coal: acc.coal + player.resources.coal,
      oil: acc.oil + player.resources.oil,
      trash: acc.trash + player.resources.trash,
      uranium: acc.uranium + player.resources.uranium,
    };
  }, { coal: 0, oil: 0, trash: 0, uranium: 0 })
);

const selectRestockRates = createSelector(
  [selectMapName, selectNumPlayers, selectEra],
  getRestockRates,
);

export const selectRestockedResourceMarket = createSelector(
  [selectRestockRates, selectTotalResourcesHeld, selectResourceMarket],
  (restockRates, resourcesHeld, resourceMarket) => {
      const newResourceMarket = Object.keys(restockRates).reduce<Partial<Resources>>((acc, r) => {
        const type = r as ResourceType;
        const total = type === "uranium" ? 12 : 24;
        const held = resourcesHeld[type];
        const inMarket = resourceMarket[type];
        const toRestock = restockRates[type];
        const limit = total - held;

        return {
          ...acc,
          [type]: Math.min(inMarket + toRestock, limit)
        };
      }, {});

      return newResourceMarket as Resources;
  }
);
