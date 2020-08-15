import { Game } from "../../entity/Game";
import { PlantStatus, PlantInstance } from "../../entity/PlantInstance";
import { getMarketLength, discardLowestPlant } from "./plantHelpers";

const drawPlant = (plants: PlantInstance[], rank: number): void => {
  const plant = plants.find(p => p.plant.rank === rank);
  if (plant) {
    plant.status = PlantStatus.MARKET;
  }
}

const drawRandomPlant = (plants: PlantInstance[]): void => {
  const randomIndex = Math.floor(Math.random() * plants.length);
  const randomRank = plants[randomIndex].plant.rank;
  drawPlant(plants, randomRank);
}

const drawPlantChina = (game: Game): void => {
  const deck = game.plants.filter(p => p.status === PlantStatus.DECK);

  const smallestRank = deck.reduce<number>((acc, plant) => (
    Math.min(acc, plant.plant.rank)
  ), Infinity);

  if (smallestRank < 31) {
    return drawPlant(deck, smallestRank);
  }

  const middleCards = deck.filter(p => p.plant.rank < 36);
  const chanceOfEra3 = 1 / (middleCards.length + 1);
  if (game.era < 3 && Math.random() < chanceOfEra3) {
    // start era 3
    discardLowestPlant(game, true);
    game.era = 3;
    return setChinaEra3Market(game);
  }
  return drawRandomPlant(middleCards);
}

export const setChinaMarket = (game: Game): void => {
  if (game.era === 3) {
    return setChinaEra3Market(game);
  }

  const numPlayers = game.playerOrder.length;
  const targetMarketSize = Math.max(numPlayers - 1, 2);
  const minPlantsToAdd = Math.floor(numPlayers / 2);

  let plantsAdded = 0;
  while (plantsAdded < minPlantsToAdd || getMarketLength(game) < targetMarketSize && game.era < 3) {
    drawPlantChina(game);
    plantsAdded++;
  }

  while (getMarketLength(game) > targetMarketSize) {
    discardLowestPlant(game, true);
  }
}

export const setChinaEra3Market = (game: Game): void => {
  while (getMarketLength(game) < 4) {
    drawPlantChina(game);
  }
}
