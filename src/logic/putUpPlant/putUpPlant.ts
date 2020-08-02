import { Game, ActionType } from "../../entity/Game";
import { PlantStatus } from "../../entity/PlantInstance";
import { Auction } from "../../entity/Auction";
import { getNextAuctionBidder } from "../utils/auctionHelpers";
import { recordPlantPhaseEvent, startResourcePhase, getAvailablePlants, obtainPlant, getNextPlayerInPlantPhase } from "../utils/plantHelpers";
import { saveGame } from "../utils/saveGame";
import { Player } from "../../entity/Player";
import { applyNorthernEuropeUraniumValidation } from "../bidOnPlant/applyNorthernEuropeUraniumValidation";

interface PutUpPlantArgs {
  plantInstanceId: number;
  bid: number;
}

export const putUpPlant = async (
  game: Game,
  me: Player,
  args: PutUpPlantArgs,
): Promise<Game> => {
  if (game.auction) {
    throw new Error("ERROR: auction in progress");
  }

  if (game.plantPhaseEvents.some((event) => event.player.id === me.id)) {
    throw new Error("ERROR: player already chose this plant phase");
  }

  if (!args.plantInstanceId) {
    if (game.turn === 1) {
      throw new Error("ERROR: pass not allowed on turn 1");
    }
    
    // handle pass
    recordPlantPhaseEvent(game, null);

    if (game.plantPhaseEvents.length === game.playerOrder.length) {
      startResourcePhase(game);
    } else {
      game.activePlayer = getNextPlayerInPlantPhase(game);
    }

    return saveGame(game);
  }

  const plantInstance = game.plants.find((pi) => pi.id === args.plantInstanceId);
  if (!plantInstance) {
    throw new Error("ERROR: plant instance not found");
  }

  if (plantInstance.status !== PlantStatus.MARKET) {
    throw new Error("ERROR: plant not in market");
  }

  const availablePlants = getAvailablePlants(game);
  if (!availablePlants.includes(plantInstance)) {
    throw new Error("ERROR: plant not currently available");
  }

  if (args.bid < plantInstance.plant.rank) {
    throw new Error("ERROR: bid too low");
  }

  if (args.bid > game.activePlayer.money) {
    throw new Error("ERROR: cannot afford bid");
  }

  if (!applyNorthernEuropeUraniumValidation(game, me, plantInstance)) {
    throw new Error("ERROR: cannot bid on uranium with current cities");
  }

  if (game.plantPhaseEvents && game.plantPhaseEvents.length < game.playerOrder.length - 1) {
    // start an auction
    const auction = new Auction();
    auction.plant = plantInstance;
    auction.bid = args.bid;
    auction.leadingPlayer = game.activePlayer;
    auction.activePlayer = getNextAuctionBidder(game, game.activePlayer);

    game.auction = auction;
    game.actionType = ActionType.BID_ON_PLANT;
  } else {
    obtainPlant(game, plantInstance, game.activePlayer, args.bid);
  }

  return game;
};
