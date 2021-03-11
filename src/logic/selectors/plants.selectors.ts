import { createSelector } from '@reduxjs/toolkit';
import { selectPlantPhaseEvents, selectPlants, selectEra } from "./info.selectors";
import { selectNumPlayers, selectMyResources, selectMe } from "./players.selectors";
import { PlantStatus } from "../types/gameState";
import { selectPlantsOffProps, selectHybridChoice, selectPlantMap, selectMapName } from "./props.selectors";
import { PlantResourceType, Plant } from "../../entity/Plant";

export const selectGetsPlantAtFace = createSelector(
  [selectPlantPhaseEvents, selectNumPlayers],
  (events, numPlayers) => events.length === numPlayers - 1
);

export const selectPlayerPlantIds = createSelector(
  [selectPlants, selectMe, (_, props) => props.username],
  (plants, me, username) => Object.keys(plants)
    .filter((plantId) => {
      const { status, owner } = plants[plantId];
      return status === PlantStatus.OWNED && owner === (username || me);
    })
);

export const selectMustDiscardPlant = createSelector(
  [selectPlayerPlantIds, selectNumPlayers],
  (myPlantIds, numPlayers) => {
    const maxPlants = numPlayers === 2 ? 4 : 3;
    return myPlantIds.length > maxPlants;
  }
);

export const selectMyResourceCapacity = createSelector(
  [selectPlayerPlantIds, selectPlantsOffProps],
  (myPlantIds, plants) => {
    return myPlantIds
      .reduce<Record<PlantResourceType, number>>((acc, plantId) => {
        const plant = plants.find(plant => '' + plant.id === plantId) as Plant;
        const { resourceType, resourceBurn } = plant;
        acc[resourceType] += resourceBurn * 2;
        return acc;
      }, { COAL: 0, OIL: 0, TRASH: 0, URANIUM: 0, HYBRID: 0, WIND: 0 });
  }
);

export const selectMyResourcesAfterDiscard = createSelector(
 [selectMyResources, selectMyResourceCapacity, selectHybridChoice],
 (myResources, capacity, hybridChoice) => {
    const uranium = Math.min(myResources.uranium, capacity.URANIUM);
    const trash = Math.min(myResources.trash, capacity.TRASH);

    if (capacity.HYBRID === 0) {
      const coal = Math.min(myResources.coal, capacity.COAL);
      const oil = Math.min(myResources.oil, capacity.OIL);

      return { coal, oil, trash, uranium };
    }

    let coal = myResources.coal;
    let oil = myResources.oil;

    // fill up coal/oil capacity with owned coal/oil
    const leftoverCoal = Math.max(myResources.coal - capacity.COAL, 0);
    const leftoverOil = Math.max(myResources.oil - capacity.OIL, 0);

    const amountToDiscard = leftoverCoal + leftoverOil - capacity.HYBRID;
    if (amountToDiscard > 0 && leftoverCoal > 0 && leftoverOil > 0 && hybridChoice) {
      coal -= hybridChoice.coal;
      oil -= hybridChoice.oil;
    } else if (amountToDiscard > 0) {
      // three ways choice can be unambiguous
      if (leftoverCoal === 0) {
        // player only has oil
        oil -= amountToDiscard;
      } else if (leftoverOil === 0) {
        // player only has coal
        coal -= amountToDiscard;
      } else {
        // player has exactly enough to discard
        coal = 0;
        oil = 0;
      }
    }

    return { coal, oil, trash, uranium };
  }
);

export const selectDeck = createSelector(
  selectPlants,
  (plants) => Object.keys(plants).filter(plantId => plants[plantId].status === PlantStatus.DECK)
);

export const selectEra3Plants = createSelector(
  selectPlants,
  (plants) => Object.keys(plants).filter(plantId => plants[plantId].status === PlantStatus.ERA_THREE)
);

const selectPlantMarket = createSelector(
  selectPlants,
  (plants) => Object.keys(plants).filter(plantId => plants[plantId].status === PlantStatus.MARKET)
);

export const selectAvailablePlants = createSelector(
  [selectPlantMarket, selectPlantMap, selectEra, selectMapName],
  (market, plantMap, era, mapName) => {
    const plantMarket = market
      .map(id => plantMap[id])
      .sort((p, q) => p.rank - q.rank);

    const isNorthernEuropeSevenSpecialCase = (
      mapName === 'NorthernEurope' &&
      plantMarket.length > 4 &&
      plantMarket[4].rank === 7 &&
      plantMarket[4].resourceType === PlantResourceType.WIND
    );

    let numAvailable = 4;

    if (isNorthernEuropeSevenSpecialCase) {
      numAvailable = 5;
    }

    if (mapName === 'China' || era === 3) {
      numAvailable = plantMarket.length;
    }

    return market
      .map(id => plantMap[id])
      .sort((p, q) => p.rank - q.rank)
      .slice(0, numAvailable)
      .map(plant => plant.id);
  }
);

export const selectPlantMarketLength = createSelector(selectPlantMarket, market => market.length);

const getLowestPlant = (plantMap: Record<string, Plant>, plantIds: string[]) => {
  const sortedMarket = plantIds.sort((a, b) => plantMap[a].rank - plantMap[b].rank);
  return plantMap[sortedMarket[0]];
};

export const selectLowestPlantInMarket = createSelector(
  [selectPlantMap, selectPlantMarket],
  getLowestPlant
);

export const selectHighestPlantInMarket = createSelector(
  [selectPlantMap, selectPlantMarket],
  (plantMap: Record<string, Plant>, plantIds: string[]) => {
    const sortedMarket = plantIds.sort((a, b) => plantMap[b].rank - plantMap[a].rank);
    return plantMap[sortedMarket[0]];
  }
);

export const selectLowestPlantInDeck = createSelector(
  [selectPlantMap, selectDeck],
  getLowestPlant
);

export const selectChinaMiddlePlants = createSelector(
  [selectPlantMap, selectDeck],
  (plantMap, deck) => deck.filter(plantId => {
    const { rank } = plantMap[plantId];
    return rank >= 31 && rank < 36;
  })
);
