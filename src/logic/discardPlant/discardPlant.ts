import { Game, Phase, ActionType } from "../../entity/Game";
import { findGameById } from "../../queries/findGameById";
import { saveGame } from "../utils/saveGame";
import { PubSub } from "apollo-server";
import { mustDiscardPlant, getNextPlayerInPlantPhase, startResourcePhase } from "../utils/plantHelpers";
import { PlantStatus } from "../../entity/PlantInstance";
import { getResourceCapacity } from "../buyResources/resourceHelpers";

export const discardPlant = async(
  gameId: number,
  meId: number,
  plantInstanceId: number,
  fossilFuelDiscard: { coal: number; oil: number; },
  pubsub: PubSub
): Promise<Game> => {
  const game = await findGameById(gameId);

  if (!game) {
    throw new Error("ERROR: game not found");
  }

  if (meId !== game.activePlayer.id) {
    throw new Error("ERROR: not your turn");
  }

  if (game.phase !== Phase.PLANT) {
    throw new Error("ERROR: incorrect phase");
  }

  if (game.actionType !== ActionType.DISCARD_PLANT) {
    throw new Error("ERROR: incorrect actionType");
  }

  if (!mustDiscardPlant(game)) {
    throw new Error("ERROR: no need to discard");
  }

  const plantInstance = game.plants.find((plant) => plant.id === plantInstanceId);
  if (!plantInstance || plantInstance.player.id !== meId) {
    throw new Error("ERROR: you don't have that plant");
  }

  if (game.plantRankBought === plantInstance.plant.rank) {
    throw new Error("ERROR: plant was just bought");
  }

  // discard the plant
  plantInstance.status = PlantStatus.DISCARDED;
  plantInstance.player = null;

  // lose resources, if necessary
  const me = game.playerOrder.find((player) => player.id === meId);
  const resourceCapacity = getResourceCapacity(game, me);

  me.resources.uranium = Math.min(me.resources.uranium, resourceCapacity.URANIUM);
  me.resources.trash = Math.min(me.resources.trash, resourceCapacity.TRASH);

  // fill up coal/oil capacity with owned coal/oil
  const leftoverCoal = Math.max(me.resources.coal - resourceCapacity.COAL, 0);
  const leftoverOil = Math.max(me.resources.oil - resourceCapacity.OIL, 0);

  const amountToDiscard = leftoverCoal + leftoverOil - resourceCapacity.HYBRID;
  if (amountToDiscard > 0 && leftoverCoal > 0 && leftoverOil > 0) {
    if (!fossilFuelDiscard) {
      throw new Error("ERROR: must provide coal/oil discard choice");
    }
    
    if (fossilFuelDiscard.coal + fossilFuelDiscard.oil !== amountToDiscard) {
      throw new Error("ERROR: discarding incorrect amount of coal/oil");
    }

    me.resources.coal -= fossilFuelDiscard.coal;
    me.resources.oil -= fossilFuelDiscard.oil;
  } else if (amountToDiscard > 0) {
    me.resources.coal -= leftoverCoal;
    me.resources.oil -= leftoverOil;
  }

  // continue
  game.plantRankBought = 0;
  if (game.plantPhaseEvents.length < game.playerOrder.length) {
    game.actionType = ActionType.PUT_UP_PLANT;
    game.activePlayer = getNextPlayerInPlantPhase(game);
  } else {
    startResourcePhase(game);
  }

  return saveGame(game, pubsub);
}
