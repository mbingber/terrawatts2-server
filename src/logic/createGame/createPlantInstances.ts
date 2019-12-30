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
  numPlayers: number
): Promise<PlantInstance[]> => {
  const plantInstanceRepository = getRepository(PlantInstance);
  const plantRepository = getRepository(Plant);

  const plants = await plantRepository.find();

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

  // await plantInstanceRepository.save(plantInstances);

  return plantInstances;
}
