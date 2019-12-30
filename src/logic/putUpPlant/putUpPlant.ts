import { getRepository } from "typeorm";
import { Game, Phase, ActionType } from "../../entity/Game";
import { findGameById } from "../../queries/findGameById";
import { PlantStatus } from "../../entity/PlantInstance";
import { Auction } from "../../entity/Auction";
import { getNextAuctionBidder } from "../utils/auctionHelpers";
import { recordPlantPhaseEvent, startResourcePhase, getAvailablePlants, obtainPlant, getNextPlayerInPlantPhase } from "../utils/plantHelpers";

export const putUpPlant = async (
  gameId: number,
  meId: number,
  plantInstanceId: number,
  bid: number
): Promise<Game> => {
  const gameRepository = getRepository(Game);
  const game = await findGameById(gameId);

  // TODO: these first two validations are universal
  if (!game) {
    throw new Error("ERROR: game not found");
  }

  if (meId !== game.activePlayer.id) {
    throw new Error("ERROR: not your turn");
  }

  if (game.phase !== Phase.PLANT) {
    throw new Error("ERROR: incorrect phase");
  }

  if (game.actionType !== ActionType.PUT_UP_PLANT) {
    throw new Error("ERROR: incorrect actionType");
  }

  if (game.auction) {
    throw new Error("ERROR: auction in progress");
  }

  if (game.plantPhaseEvents && game.plantPhaseEvents.some(event => event.player.id === meId)) {
    throw new Error("ERROR: player already chose this plant phase");
  }

  if (!plantInstanceId) {
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

    return gameRepository.save(game);;
  }

  const plantInstance = game.plants.find((pi) => pi.id === plantInstanceId);
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

  if (bid < plantInstance.plant.rank) {
    throw new Error("ERROR: bid too low");
  }

  if (bid > game.activePlayer.money) {
    throw new Error("ERROR: cannot afford bid");
  }

  if (game.plantPhaseEvents && game.plantPhaseEvents.length < game.playerOrder.length - 1) {
    // start an auction
    const auction = new Auction();
    auction.plant = plantInstance;
    auction.bid = bid;
    auction.leadingPlayer = game.activePlayer;
    auction.activePlayer = getNextAuctionBidder(game, game.activePlayer);

    game.auction = auction;
    game.actionType = ActionType.BID_ON_PLANT; 
  } else {
    await obtainPlant(game, plantInstance, game.activePlayer, bid);
  }

  // TODO: abstract "save game" function
  return gameRepository.save(game);
};
