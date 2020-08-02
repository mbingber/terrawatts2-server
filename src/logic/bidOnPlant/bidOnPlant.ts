import { Game  } from "../../entity/Game";
import { getNextAuctionBidder, isAuctionOver } from "../utils/auctionHelpers";
import { obtainPlant } from "../utils/plantHelpers";
import { Player } from "../../entity/Player";
import { applyNorthernEuropeUraniumValidation } from "./applyNorthernEuropeUraniumValidation";

interface BidOnPlantArgs {
  bid: number;
}

export const bidOnPlant = async (
  game: Game,
  me: Player,
  args: BidOnPlantArgs
): Promise<Game> => {
  if (!game.auction) {
    throw new Error("ERROR: auction not in progress");
  }

  if (args.bid !== null && args.bid <= game.auction.bid) {
    throw new Error("ERROR: bid too low");
  }

  if (args.bid > game.auction.activePlayer.money) {
    throw new Error("ERROR: cannot afford bid");
  }

  if (!applyNorthernEuropeUraniumValidation(game, me, game.auction.plant)) {
    throw new Error("ERROR: cannot bid on uranium with current cities");
  }

  if (args.bid) {
    game.auction.bid = args.bid;
    game.auction.leadingPlayer = game.auction.activePlayer;
    game.auction.activePlayer = getNextAuctionBidder(game, game.auction.activePlayer);
  } else {
    // handle pass
    const passer = game.auction.activePlayer;
    game.auction.activePlayer = getNextAuctionBidder(game, passer);
    game.auction.passedPlayers = [...game.auction.passedPlayers, passer]

    if (isAuctionOver(game)) {
      const plantInstance = game.plants.find((p) => p.id === game.auction.plant.id);
      obtainPlant(game, plantInstance, game.auction.leadingPlayer, game.auction.bid);
      game.auction = null;
    }
  }

  return game;
};
