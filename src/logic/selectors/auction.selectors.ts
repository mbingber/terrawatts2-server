import { createSelector } from "reselect";
import { selectPlayerOrder, selectPlantPhaseEvents, selectAuction } from "./info.selectors";
import { selectMe } from "./players.selectors";

const selectAuctionParticipants = createSelector(
  [selectPlayerOrder, selectPlantPhaseEvents, selectAuction],
  (players, events, auction) => players
    .filter((player) => events.every((event) => event.username !== player.username))
    .filter((player) => !auction || auction.passed.every(name => name !== player.username))
    .sort((playerA, playerB) => playerA.clockwiseOrder - playerB.clockwiseOrder)
    .map(p => p.username)
)

export const selectNextAuctionBidder = createSelector(
  [selectMe, selectAuctionParticipants],
  (me, participants) => {
    const currentPlayerIdx = participants.indexOf(me);
    return participants[(currentPlayerIdx + 1) % participants.length];
  }
);

export const selectIsAuctionOver = createSelector(selectAuctionParticipants, participants => participants.length === 1);
export const selectAuctionBid = createSelector(selectAuction, auction => auction && auction.bid || 0);
