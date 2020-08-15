import { Resources } from "../../entity/Resources";
import { Game } from "../../entity/Game";

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

export const getStartingResourceMarket = (game: Game): Resources => {
  return startingMarkets[game.map.name] || startingMarkets.default;
}
