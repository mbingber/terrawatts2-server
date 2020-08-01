import { Resources } from "../../entity/Resources";

const createRestockRates = (
  coal: number,
  oil: number,
  trash: number,
  uranium: number
): Resources => {
  const r = new Resources();

  r.coal = coal;
  r.oil = oil;
  r.trash = trash;
  r.uranium = uranium;

  return r;
}

const restockRateHash: Record<string, Record<number, Record<string, Resources>>> = {
  USA: {
    2: {
      era1: createRestockRates(3,2,1,1),
      era2: createRestockRates(4,2,2,1),
      era3: createRestockRates(3,4,3,1),
    },
    3: {
      era1: createRestockRates(4,2,1,1),
      era2: createRestockRates(5,3,2,1),
      era3: createRestockRates(3,4,3,1),
    },
    4: {
      era1: createRestockRates(5,3,2,1),
      era2: createRestockRates(6,4,3,2),
      era3: createRestockRates(4,5,4,2),
    },
    5: {
      era1: createRestockRates(5,4,3,2),
      era2: createRestockRates(7,5,3,3),
      era3: createRestockRates(5,6,5,2),
    },
    6: {
      era1: createRestockRates(7,5,3,2),
      era2: createRestockRates(9,6,5,3),
      era3: createRestockRates(6,7,6,3),
    },
  },
  ['Northern Europe']: {
    2: {
      era1: createRestockRates(2,1,1,1),
      era2: createRestockRates(4,2,2,2),
      era3: createRestockRates(3,3,3,2),
    },
    3: {
      era1: createRestockRates(3,2,1,1),
      era2: createRestockRates(4,2,2,2),
      era3: createRestockRates(4,3,3,2),
    },
    4: {
      era1: createRestockRates(4,2,2,2),
      era2: createRestockRates(5,3,3,3),
      era3: createRestockRates(5,4,4,2),
    },
    5: {
      era1: createRestockRates(4,3,3,2),
      era2: createRestockRates(5,4,3,4),
      era3: createRestockRates(6,5,5,3),
    },
    6: {
      era1: createRestockRates(6,4,3,2),
      era2: createRestockRates(8,5,5,4),
      era3: createRestockRates(5,6,6,4),
    },
  }
};

export const getRestockRates = (mapName: string, numPlayers: number) => {
  const ratesForMap = restockRateHash[mapName] || restockRateHash.USA;

  return ratesForMap[numPlayers];
}
