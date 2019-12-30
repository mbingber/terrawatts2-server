import { Game } from "../../entity/Game";
import { Player } from "../../entity/Player";

const getAuctionParticipants = (game: Game): Player[] => game
  .playerOrder
  .filter((player) => game.plantPhaseEvents.every((event) => event.player.id !== player.id))
  .filter((player) => !game.auction || !game.auction.passedPlayers || game.auction.passedPlayers.every(p => p.id !== player.id))
  .sort((playerA, playerB) => playerA.clockwiseOrder - playerB.clockwiseOrder);

export const getNextAuctionBidder = (game: Game, currentBidder: Player): Player => {
  const participants = getAuctionParticipants(game);
  const currentPlayerIdx = participants.findIndex(p => p.id === currentBidder.id);
  return participants[(currentPlayerIdx + 1) % participants.length];
};

export const isAuctionOver = (game: Game): boolean => getAuctionParticipants(game).length === 1;
