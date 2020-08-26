import { Game, ActionType } from "../../entity/Game";
import { mustDiscardPlant, getNextPlayerInPlantPhase, startResourcePhase } from "../utils/plantHelpers";
import { PlantStatus } from "../../entity/PlantInstance";
import { getResourceCapacity } from "../buyResources/resourceHelpers";
import { Player } from "../../entity/Player";

interface DiscardPlantArgs {
  plantInstanceId: number;
  fossilFuelDiscard: { coal: number; oil: number; };
}

export const discardPlant = async(
  game: Game,
  me: Player,
  args: DiscardPlantArgs,
): Promise<Game> => {
  if (!mustDiscardPlant(game, me)) {
    throw new Error("ERROR: no need to discard");
  }

  const plantInstance = game.plants.find((plant) => plant.id === args.plantInstanceId);
  if (!plantInstance || plantInstance.player.id !== me.id) {
    throw new Error("ERROR: you don't have that plant");
  }

  if (game.plantRankBought === plantInstance.plant.rank) {
    throw new Error("ERROR: plant was just bought");
  }

  // discard the plant
  plantInstance.status = PlantStatus.DISCARDED;
  plantInstance.player = null;

  // lose resources, if necessary
  const resourceCapacity = getResourceCapacity(game, me);

  me.resources.uranium = Math.min(me.resources.uranium, resourceCapacity.URANIUM);
  me.resources.trash = Math.min(me.resources.trash, resourceCapacity.TRASH);

  if (resourceCapacity.HYBRID === 0) {
    me.resources.coal = Math.min(me.resources.coal, resourceCapacity.COAL);
    me.resources.oil = Math.min(me.resources.oil, resourceCapacity.OIL);
  } else {
    // fill up coal/oil capacity with owned coal/oil
    const leftoverCoal = Math.max(me.resources.coal - resourceCapacity.COAL, 0);
    const leftoverOil = Math.max(me.resources.oil - resourceCapacity.OIL, 0);
  
    const amountToDiscard = leftoverCoal + leftoverOil - resourceCapacity.HYBRID;
    if (amountToDiscard > 0 && leftoverCoal > 0 && leftoverOil > 0) {
      // choice is ambiguous
      if (!args.fossilFuelDiscard) {
        throw new Error("ERROR: must provide coal/oil discard choice");
      }
      
      if (args.fossilFuelDiscard.coal + args.fossilFuelDiscard.oil !== amountToDiscard) {
        throw new Error("ERROR: discarding incorrect amount of coal/oil");
      }
  
      me.resources.coal -= args.fossilFuelDiscard.coal;
      me.resources.oil -= args.fossilFuelDiscard.oil;
    } else if (amountToDiscard > 0) {
      // three ways choice can be unambiguous
      if (leftoverCoal === 0) {
        // player only has oil
        me.resources.oil -= amountToDiscard;
      } else if (leftoverOil === 0) {
        // player only has coal
        me.resources.coal -= amountToDiscard;
      } else {
        // player has exactly enough to discard
        me.resources.coal = 0;
        me.resources.oil = 0;
      }
    }
  }

  // continue
  game.plantRankBought = 0;
  if (game.plantPhaseEvents.length < game.playerOrder.length) {
    game.actionType = ActionType.PUT_UP_PLANT;
    game.activePlayer = getNextPlayerInPlantPhase(game);
  } else {
    startResourcePhase(game);
  }

  return game;
}
