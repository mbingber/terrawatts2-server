import { Player } from "../../entity/Player";
import { Game } from "../../entity/Game";
import { CityInstance } from "../../entity/CityInstance";
import { PlantInstance } from "../../entity/PlantInstance";

const getNumCities = (cities: CityInstance[], player: Player): number => (
  cities.filter(c => c.players && c.players.some(p => p.id === player.id)).length
);

const getHighestPlant = (plants: PlantInstance[], player: Player): number => (
  plants
    .filter(p => p.player && p.player.id === player.id)
    .reduce<number>((acc, p) => Math.max(acc, p.plant.rank), 0)
);

export const getTurnOrder = (game: Game): Player[] => (
  game.playerOrder.sort((playerA, playerB) => {
    const numCitiesA = getNumCities(game.cities, playerA);
    const numCitiesB = getNumCities(game.cities, playerB);

    if (numCitiesA > numCitiesB) {
      return 1;
    }

    if (numCitiesA < numCitiesB) {
      return -1;
    }

    return getHighestPlant(game.plants, playerA) - getHighestPlant(game.plants, playerB);
  })
)
