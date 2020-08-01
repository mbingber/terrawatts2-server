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

export const createPlantInstances = async (
  numPlayers: number,
  mapName: string,
  regions: number[],
): Promise<PlantInstance[]> => {
  const plantRepository = getRepository(Plant);

  const allPlants = await plantRepository.find();
  const rankToPlants = allPlants.reduce<Record<number, Plant[]>>((acc, plant) => {
    acc[plant.rank] = acc[plant.rank] || [];
    acc[plant.rank].push(plant);
    return acc;
  }, {});

  const plants = Object.values(rankToPlants).map(plantSubset => {
    const matchedPlant = plantSubset.find(p => p.mapName === mapName && regions.includes(p.region));
    const defaultPlant = plantSubset.find(p => !p.mapName);

    return matchedPlant || defaultPlant;
  });

  const deck = plants.filter(p => p.rank > 10 && p.rank !== 13);

  const removed = shuffle(deck).slice(0, amountToRemove[numPlayers]);

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

  return plantInstances;
}
