import { createSelector } from '@reduxjs/toolkit';
import { selectMaxNumCities } from './cities.selectors';
import { Phase, PlantStatus, Player } from '../types/gameState';
import { PlantResourceType, Plant } from '../../entity/Plant';
import { selectNumPlayers } from './players.selectors';
import { numCitiesToEndGame } from '../utils/cityMilestones';
import { selectPlantMap } from './props.selectors';
import {
  selectCities,
  selectPlayerOrder,
  selectPhase,
  selectPlants
} from './info.selectors';
import { getResourcesNeededToPower } from './powerUp.selectors';

export type GameOverPlayer = Player & {
  numPowered: number;
  numCities: number;
  won: boolean;
}

export const selectIsGameOver = createSelector(
  [selectPhase, selectMaxNumCities, selectNumPlayers],
  (phase, maxNumCities, numPlayers) => (
    phase === Phase.POWER && maxNumCities >= numCitiesToEndGame(numPlayers)
  )
);

// this is being called with at most 4 elements, so should be fine
const getPowerset = <T>(list: T[]): T[][] => list
  .reduce((acc, element) => (
    [...acc, ...acc.map(subset => [...subset, element])]
  ), [[]]);

// returns map of username to number of cities powered
const selectNumPoweredMap = createSelector(
  [selectPlayerOrder, selectCities, selectPlantMap, selectPlants],
  (players, cities, plantData, plantStatusMap) => {
    return players.reduce<Record<string, { numPowered: number, numCities: number }>>((acc, player) => {
      // TODO: abstract from cities.selectors
      const numCities = Object.values(cities)
        .filter(occupants => occupants.includes(player.username))
        .length;

      // TODO: abstract from plants.selectors
      const ownedPlants = Object.keys(plantStatusMap)
        .filter((plantId) => {
          const { status, owner } = plantStatusMap[plantId];
          return status === PlantStatus.OWNED && owner === player.username;
        })
        .map((plantId) => plantData[plantId]);

      const powerCapacity = getPowerset<Plant>(ownedPlants)
        .filter((plants) => {
          const ownedResources = { ...player.resources };
          // leave only the options that the player has enough resources to power
          const resourcesNeeded = getResourcesNeededToPower(plants);
          return [
            PlantResourceType.COAL,
            PlantResourceType.OIL,
            PlantResourceType.TRASH,
            PlantResourceType.URANIUM,
            PlantResourceType.HYBRID // last for a reason
          ].every(resourceType => {
            const needed = resourcesNeeded[resourceType];
            if (!needed) {
              return true;
            } else if (resourceType === PlantResourceType.HYBRID) {
              return ownedResources.coal + ownedResources.oil >= needed;
            } else {
              const r = resourceType.toLowerCase();
              ownedResources[r] = ownedResources[r] || 0;
              ownedResources[r] -= needed;
              return ownedResources[r] >= 0;
            }
          })
        })
        .reduce((currentMax, powerOption) => {
          const numPowered = powerOption.reduce((acc, plant) => acc + plant.numCities, 0);
          return Math.max(currentMax, numPowered);
        }, 0);

      acc[player.username] = {
        numPowered: Math.min(powerCapacity, numCities),
        numCities,
      };
      return acc;
    }, {});
  }
);

const playerWon = (
  player: Omit<GameOverPlayer, 'won'>,
  index: number,
  array: Array<Omit<GameOverPlayer, 'won'>>
): boolean => {
  if (index === 0) {
    return true;
  }
  const prevPlayer = array[index - 1];
  return (
    playerWon(prevPlayer, index - 1, array) &&
    prevPlayer.numPowered === player.numPowered &&
    prevPlayer.money === player.money
  );
}

export const selectGameOverPlayerData = createSelector(
  [selectNumPoweredMap, selectPlayerOrder],
  (numPoweredMap, players): GameOverPlayer[] => players
    .map(player => ({
      ...player,
      ...numPoweredMap[player.username],
    }))
    .sort((a, b) => {
      if (a.numPowered === b.numPowered) {
        return b.money - a.money;
      }
      return b.numPowered - a.numPowered;
    })
    .map((player, i, array) => {
      return {
        ...player,
        won: playerWon(player, i, array),
      };
    })
);
