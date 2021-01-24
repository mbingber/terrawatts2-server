import { Phase, ActionType, Player, Resources, PlantInfo, PlantStatus } from './types/gameState';
import { GameState } from './rootReducer';
import { shuffle } from './utils/shuffle';
import { Context } from './types/thunks';
import { User, Color } from '../entity/User';
import { Plant } from '../entity/Plant';

const getStartingResourceMarket = (mapName: string): Resources => {
  const startingMarkets: Record<string, Resources> = {
    Italy: {
      coal: 18,
      oil: 15,
      trash: 12,
      uranium: 2
    },
    ['Northern Europe']: {
      coal: 18,
      oil: 18,
      trash: 12,
      uranium: 6,
    },
    China: {
      coal: 12,
      oil: 12,
      trash: 6,
      uranium: 0
    },
    default: {
      coal: 24,
      oil: 18,
      trash: 6,
      uranium: 2
    }
  };
  return startingMarkets[mapName] || startingMarkets.default;
};

const createPlayerOrder = (users: User[]): Player[] => {
  // TODO: this can potentially mess up colors, if someone changes their preferred color
  const colorSet = new Set([Color.BLACK, Color.RED, Color.GREEN, Color.YELLOW, Color.PURPLE, Color.BLUE]);
  return users.map((user: User, idx: number): Player => {
    const { username, preferredColor } = user;

    const color: Color = preferredColor && colorSet.has(preferredColor) ?
      preferredColor :
      colorSet.values().next().value;
    
    colorSet.delete(color);

    return {
      username,
      color,
      money: 50,
      resources: {
        coal: 0,
        oil: 0,
        trash: 0,
        uranium: 0,
      },
      clockwiseOrder: idx,
      totalPlantSpend: 0,
      totalResourceSpend: 0,
      totalCitySpend: 0,
      totalEarn: 0,
    }
  });
};

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

const createInitialPlantsChina = (plants: Plant[], numPlayers: number): Record<number, PlantInfo> => {
  let marketSize = 0;
  return plants.sort((a, b) => a.rank - b.rank).reduce<Record<string, PlantInfo>>((acc, plant) => {
    let status = PlantStatus.DECK;

    if (chinaRemoval[numPlayers].includes(plant.rank)) {
      status = PlantStatus.REMOVED_BEFORE_START_FIXED;
    } else if (marketSize < numPlayers) {
      status = PlantStatus.MARKET;
      marketSize++;
    }

    acc[plant.id] = {
      status,
      owner: null
    };

    return acc;
  }, {});
};

export const createInitialPlants = (
  plantList: Plant[],
  numPlayers: number,
  mapName: string,
  regions: number[],
  rand: () => number,
): Record<number, PlantInfo> => {
  const rankToPlants = plantList.reduce<Record<number, Plant[]>>((acc, plant) => {
    if (plant.mapName !== 'Seattle') {
      acc[plant.rank] = acc[plant.rank] || [];
      acc[plant.rank].push(plant);
    }
    return acc;
  }, {});

  const extraPlant = mapName === 'Seattle' && plantList.find(p => p.mapName === 'Seattle');

  const plants: Plant[] = Object.values(rankToPlants).map(plantSubset => {
    const matchedPlant = plantSubset.find(p => p.mapName === mapName && regions.includes(p.region));
    const defaultPlant = plantSubset.find(p => !p.mapName) as Plant;
    return matchedPlant || defaultPlant;
  }).filter(x => !!x);

  if (mapName === 'China') {
    return createInitialPlantsChina(plants, numPlayers);
  }

  const deck = plants.filter(p => p.rank > 10 && p.rank !== 13);

  const removed = shuffle(deck, rand).slice(0, amountToRemove[numPlayers] + +(!!extraPlant));

  const plantStatusMap = plants.reduce<Record<string, PlantInfo>>((acc, plant) => {
    let status = PlantStatus.DECK;
    if (removed.includes(plant)) {
      status = PlantStatus.REMOVED_BEFORE_START;
    }
    if (plant.rank <= 10) {
      status = PlantStatus.MARKET;
    }

    acc[plant.id] = {
      status,
      owner: null
    };

    return acc;
  }, {});

  if (extraPlant) {
    plantStatusMap[extraPlant.id] = {
      status: PlantStatus.DECK,
      owner: null,
    };
  }

  return plantStatusMap;
}

export const getInitialState = (context: Context): GameState => {
  const { plantList, game, rand } = context;
  
  const playerOrder = createPlayerOrder(shuffle(game.users, rand));

  return {
    info: {
      turn: 1,
      era: 1,
      phase: Phase.PLANT,
      actionType: ActionType.PUT_UP_PLANT,
      activeUser: playerOrder[0].username,
    },
    playerOrder,
    plants: createInitialPlants(plantList, playerOrder.length, game.map.name, game.regions, rand),
    resourceMarket: getStartingResourceMarket(game.map.name),
    cities: {},
    auction: null,
    plantPhaseEvents: [],
  };
};
