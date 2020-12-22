import { Resources } from "../types/gameState";

const createRestockRates = (
  coal: number,
  oil: number,
  trash: number,
  uranium: number
): Resources => ({
  coal,
  oil,
  trash,
  uranium,
});

const restockRateHash: Record<string, Record<number, Record<string, Resources>>> = {
  USA: {
    2: {
      1: createRestockRates(3,2,1,1),
      2: createRestockRates(4,2,2,1),
      3: createRestockRates(3,4,3,1),
    },
    3: {
      1: createRestockRates(4,2,1,1),
      2: createRestockRates(5,3,2,1),
      3: createRestockRates(3,4,3,1),
    },
    4: {
      1: createRestockRates(5,3,2,1),
      2: createRestockRates(6,4,3,2),
      3: createRestockRates(4,5,4,2),
    },
    5: {
      1: createRestockRates(5,4,3,2),
      2: createRestockRates(7,5,3,3),
      3: createRestockRates(5,6,5,2),
    },
    6: {
      1: createRestockRates(7,5,3,2),
      2: createRestockRates(9,6,5,3),
      3: createRestockRates(6,7,6,3),
    },
  },
  ['Northern Europe']: {
    2: {
      1: createRestockRates(2,1,1,1),
      2: createRestockRates(4,2,2,2),
      3: createRestockRates(3,3,3,2),
    },
    3: {
      1: createRestockRates(3,2,1,1),
      2: createRestockRates(4,2,2,2),
      3: createRestockRates(4,3,3,2),
    },
    4: {
      1: createRestockRates(4,2,2,2),
      2: createRestockRates(5,3,3,3),
      3: createRestockRates(5,4,4,2),
    },
    5: {
      1: createRestockRates(4,3,3,2),
      2: createRestockRates(5,4,3,4),
      3: createRestockRates(6,5,5,3),
    },
    6: {
      1: createRestockRates(6,4,3,2),
      2: createRestockRates(8,5,5,4),
      3: createRestockRates(5,6,6,4),
    },
  },
  China: {
    2: {
      1: createRestockRates(4,2,2,1),
      2: createRestockRates(4,2,2,1),
      3: createRestockRates(3,4,1,1),
    },
    3: {
      1: createRestockRates(5,3,2,1),
      2: createRestockRates(5,3,2,1),
      3: createRestockRates(3,4,1,1),
    },
    4: {
      1: createRestockRates(6,4,3,2),
      2: createRestockRates(6,4,3,2),
      3: createRestockRates(4,5,2,2),
    },
    5: {
      1: createRestockRates(7,5,3,3),
      2: createRestockRates(7,5,3,3),
      3: createRestockRates(5,6,3,2),
    },
    6: {
      1: createRestockRates(9,6,5,3),
      2: createRestockRates(9,6,5,3),
      3: createRestockRates(6,7,3,3),
    },
  }
};

export const getRestockRates = (mapName: string, numPlayers: number, era: number): Resources => {
  const ratesForMap = restockRateHash[mapName] || restockRateHash.USA;
  const ratesForPlayers = ratesForMap[numPlayers] || ratesForMap[2];
  return ratesForPlayers[era];
}

export const getRestockRatesForAllEras = (mapName: string, numPlayers: number): Record<string, Resources> => ({
  era1: getRestockRates(mapName, numPlayers, 1),
  era2: getRestockRates(mapName, numPlayers, 2),
  era3: getRestockRates(mapName, numPlayers, 3),
});
