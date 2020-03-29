import { Game, Phase, ActionType } from "../../entity/Game";
import { findGameById } from "../../queries/findGameById";
import { getNextAuctionBidder, isAuctionOver } from "../utils/auctionHelpers";
import { obtainPlant } from "../utils/plantHelpers";
import { saveGame } from "../utils/saveGame";
import { PubSub } from "apollo-server";

export const bidOnPlant = async (
  gameId: number,
  meId: number,
  bid: number,
  pubsub: PubSub
): Promise<Game> => {
  const game = await findGameById(gameId);
  
  if (!game) {
    throw new Error("ERROR: game not found");
  }

  if (!game.auction) {
    throw new Error("ERROR: auction not in progress");
  }

  if (meId !== game.auction.activePlayer.id) {
    throw new Error("ERROR: not your turn");
  }

  if (game.phase !== Phase.PLANT) {
    throw new Error("ERROR: incorrect phase");
  }

  if (game.actionType !== ActionType.BID_ON_PLANT) {
    throw new Error("ERROR: incorrect actionType");
  }

  if (bid !== null && bid <= game.auction.bid) {
    throw new Error("ERROR: bid too low");
  }

  if (bid > game.auction.activePlayer.money) {
    throw new Error("ERROR: cannot afford bid");
  }

  if (bid) {
    game.auction.bid = bid;
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
  
  return saveGame(game, pubsub);
};
