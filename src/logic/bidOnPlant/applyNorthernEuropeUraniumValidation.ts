import { Game } from "../../entity/Game";
import { Player } from "../../entity/Player";
import { PlantInstance } from "../../entity/PlantInstance";
import { PlantResourceType } from "../../entity/Plant";

// returns false if player cannot buy the plant
// only returns false if:
// 1) It's a uranium plant
// 2) It's the Northern Europe map
// 3) Player does not own a city in region 3, 4, 5 or 6
export const applyNorthernEuropeUraniumValidation = (
  game: Game,
  me: Player,
  plant: PlantInstance,
): boolean => {
  if (plant.plant.resourceType !== PlantResourceType.URANIUM) {
    return true;
  }
  
  if (game.map.name !== "Northern Europe") {
    return true;
  }

  return game.cities.some(c => (
    c.city.region > 2 &&
    c.players.some(p => p.id === me.id)
  ))
};
