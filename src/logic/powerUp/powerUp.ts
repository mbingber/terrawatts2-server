import { Game, Phase, ActionType } from "../../entity/Game";
import { findGameById } from "../../queries/findGameById";
import { saveGame } from "../utils/saveGame";
import { PubSub } from "apollo-server";
import { PlantResourceType } from "../../entity/Plant";
import { makeMoney } from "./makeMoney";
import { endTurn } from "./endTurn";

export const powerUp = async(
  gameId: number,
  meId: number,
  plantInstanceIds: string[],
  hybridChoice: { coal: number; oil: number },
  pubsub: PubSub
): Promise<Game> => {
  const game = await findGameById(gameId);

  if (!game) {
    throw new Error("ERROR: game not found");
  }

  if (meId !== game.activePlayer.id) {
    throw new Error("ERROR: not your turn");
  }

  if (game.phase !== Phase.POWER) {
    throw new Error("ERROR: incorrect phase");
  }

  if (game.actionType !== ActionType.POWER_UP) {
    throw new Error("ERROR: incorrect actionType");
  }

  const me = game.playerOrder.find((player) => player.id === meId);
  if (plantInstanceIds.some((plantInstanceId) => me.plants.every((p) => p.id !== +plantInstanceId))) {
    throw new Error("ERROR: you do not own some of those plants");
  }

  const plantsPowering = me.plants
    .filter((plantInstance) => plantInstanceIds.includes(plantInstance.id.toString()));

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
    
    if (r === PlantResourceType.HYBRID) {
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

  if (hybridChoiceNeeded && !hybridChoice) {
    throw new Error("ERROR: need to make a hybrid choice");
  }

  if (hybridChoiceNeeded && (hybridChoice.coal > myResourcesCopy.coal || hybridChoice.oil > myResourcesCopy.oil)) {
    throw new Error("ERROR: not enough resources for hybrid choice");
  }

  // spend resources
  if (hybridChoiceNeeded) {
    myResourcesCopy.coal -= hybridChoice.coal;
    myResourcesCopy.oil -= hybridChoice.oil;
  }
  me.resources = myResourcesCopy;
  
  const powerCapacity = plantsPowering.reduce<number>((acc, plant) => {
    return acc + plant.plant.numCities;
  }, 0);

  const numCities = game.cities.filter((cityInstance) => (
    cityInstance.players.some((p) => p.id === meId)
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

  return saveGame(game, pubsub)
}
