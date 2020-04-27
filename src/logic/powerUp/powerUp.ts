import { Game } from "../../entity/Game";
import { PlantResourceType } from "../../entity/Plant";
import { makeMoney } from "./makeMoney";
import { endTurn } from "./endTurn";
import { Player } from "../../entity/Player";

interface PowerUpArgs {
  plantInstanceIds: string[];
  hybridChoice: { coal: number; oil: number };
}

export const powerUp = async(
  game: Game,
  me: Player,
  args: PowerUpArgs
): Promise<Game> => {
  if (args.plantInstanceIds.some((plantInstanceId) => me.plants.every((p) => p.id !== +plantInstanceId))) {
    throw new Error("ERROR: you do not own some of those plants");
  }

  const plantsPowering = me.plants
    .filter((plantInstance) => args.plantInstanceIds.includes(plantInstance.id.toString()));
  
  const hasHybrid = plantsPowering.some(p => p.plant.resourceType === PlantResourceType.HYBRID);

  const resourcesNeeded = plantsPowering
    .reduce<Partial<Record<PlantResourceType, number>>>((acc, plantInstance) => {
      const { resourceType, resourceBurn } = plantInstance.plant;

      if (resourceType !== PlantResourceType.WIND) {
        acc[resourceType] = acc[resourceType] || 0;
        acc[resourceType] += resourceBurn;
      }
      
      return acc;
    }, {});

  const myResourcesCopy = { ...me.resources };

  let hybridChoiceNeeded = false;

  const hasEnoughResources = [
    PlantResourceType.COAL,
    PlantResourceType.OIL,
    PlantResourceType.TRASH,
    PlantResourceType.URANIUM,
    PlantResourceType.HYBRID
  ].every((r) => {
    const numResources = resourcesNeeded[r] || 0;
    
    if (r === PlantResourceType.HYBRID && hasHybrid) {
      const remainingFossilFuel = myResourcesCopy.coal + myResourcesCopy.oil;
      if (remainingFossilFuel > numResources && myResourcesCopy.coal > 0 && myResourcesCopy.oil > 0) {
        hybridChoiceNeeded = true;
      } else if (remainingFossilFuel >= numResources) {
        if (myResourcesCopy.coal > 0) {
          myResourcesCopy.coal -= numResources;
        } else {
          myResourcesCopy.oil -= numResources;
        }
      }
      return numResources <= remainingFossilFuel;
    }
    
    const rLower = r.toLowerCase();
    if (numResources > myResourcesCopy[rLower]) {
      return false;
    }

    myResourcesCopy[rLower] -= numResources;
    return true;
  });

  if (!hasEnoughResources) {
    throw new Error("ERROR: not enough resources to power");
  }

  if (hybridChoiceNeeded && !args.hybridChoice) {
    throw new Error("ERROR: need to make a hybrid choice");
  }

  if (hybridChoiceNeeded && (args.hybridChoice.coal > myResourcesCopy.coal || args.hybridChoice.oil > myResourcesCopy.oil)) {
    throw new Error("ERROR: not enough resources for hybrid choice");
  }

  // spend resources
  if (hybridChoiceNeeded) {
    myResourcesCopy.coal -= args.hybridChoice.coal;
    myResourcesCopy.oil -= args.hybridChoice.oil;
  }
  me.resources = myResourcesCopy;
  
  const powerCapacity = plantsPowering.reduce<number>((acc, plant) => {
    return acc + plant.plant.numCities;
  }, 0);

  const numCities = game.cities.filter((cityInstance) => (
    cityInstance.players.some((p) => p.id === me.id)
  )).length;

  const numPowered = Math.min(powerCapacity, numCities);
  me.numPowered = numPowered;
  me.money += makeMoney(numPowered);

  // advance turn order
  // TODO: abstract this? (almost identical to resource, city)
  const activePlayerIdx = game.playerOrder.findIndex(player => player.id === game.activePlayer.id);
  if (activePlayerIdx === game.playerOrder.length - 1) {
    // end turn
    endTurn(game);
  } else {
    // advance to next player
    game.activePlayer = game.playerOrder[activePlayerIdx + 1];
  }

  return game;
}
