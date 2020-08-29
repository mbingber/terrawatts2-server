import { getRepository } from 'typeorm';
import { Plant } from '../../entity/Plant';
import { PlantInstance, PlantStatus } from '../../entity/PlantInstance';
import * as shuffle from 'lodash.shuffle';

const amountToRemove: Record<number, number> = {
  2: 8,
  3: 8,
  4: 4,
  5: 0,
  6: 0
};

const chinaRemoval: Record<number, number[]> = {
  2: [3, 4, 9, 11, 16, 18, 20, 24, 30, 33, 46],
  3: [3, 4, 9, 11, 16, 18, 20, 24, 30, 33, 46],
  4: [3, 4, 11, 18, 24, 33, 46],
  5: [3, 4, 33],
  6: [3, 4, 33]
};

const createPlantInstancesChina = (plants: Plant[], numPlayers: number): PlantInstance[] => {
  let marketSize = 0;
  return plants.sort((a, b) => a.rank - b.rank).map((plant) => {
    const plantInstance = new PlantInstance();
    plantInstance.plant = plant;

    if (chinaRemoval[numPlayers].includes(plant.rank)) {
      plantInstance.status = PlantStatus.REMOVED_BEFORE_START;
    } else if (marketSize < numPlayers) {
      plantInstance.status = PlantStatus.MARKET;
      marketSize++;
    } else {
      plantInstance.status = PlantStatus.DECK;
    }

    return plantInstance;
  });
};

export const createPlantInstances = async (
  numPlayers: number,
  mapName: string,
  regions: number[],
): Promise<PlantInstance[]> => {
  const plantRepository = getRepository(Plant);

  const allPlants = await plantRepository.find();
  const rankToPlants = allPlants.reduce<Record<number, Plant[]>>((acc, plant) => {
    if (plant.mapName !== 'Seattle') {
      acc[plant.rank] = acc[plant.rank] || [];
      acc[plant.rank].push(plant);
    }
    return acc;
  }, {});

  const extraPlant = mapName === 'Seattle' && allPlants.find(p => p.mapName === 'Seattle');

  const plants = Object.values(rankToPlants).map(plantSubset => {
    const matchedPlant = plantSubset.find(p => p.mapName === mapName && regions.includes(p.region));
    const defaultPlant = plantSubset.find(p => !p.mapName);

    return matchedPlant || defaultPlant;
  });

  if (mapName === 'China') {
    return createPlantInstancesChina(plants, numPlayers);
  }

  const deck = plants.filter(p => p.rank > 10 && p.rank !== 13);

  const removed = shuffle(deck).slice(0, amountToRemove[numPlayers] + +(!!extraPlant));

  const plantInstances: PlantInstance[] = plants.map((plant) => {
    const plantInstance = new PlantInstance();

    plantInstance.plant = plant;
    plantInstance.status = PlantStatus.DECK;
    if (removed.includes(plant)) {
      plantInstance.status = PlantStatus.REMOVED_BEFORE_START;
    }
    if (plant.rank <= 10) {
      plantInstance.status = PlantStatus.MARKET;
    }

    return plantInstance;
  });

  if (extraPlant) {
    const instance = new PlantInstance();
    instance.plant = extraPlant;
    instance.status = PlantStatus.DECK;
    plantInstances.push(instance);
  }

  return plantInstances;
}
