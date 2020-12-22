import { createReducer } from "redux-act";
import { Auction } from "../types/gameState";
import { startAuction, setAuctionBid, setAuctionLeader, setAuctionActiveUser, addToAuctionPassed, endAuction } from "../actions/auction.actions";

const reducer = createReducer<Auction | null>({}, null);

reducer.on(startAuction, (_, auction) => auction);

reducer.on(setAuctionBid, (auction, bid) => {
  if (!auction) return null;

  return {
    ...auction,
    bid,
  };
});

reducer.on(setAuctionLeader, (auction, leader) => {
  if (!auction) return null;

  return {
    ...auction,
    leader,
  };
});

reducer.on(setAuctionActiveUser, (auction, active) => {
  if (!auction) return null;

  return {
    ...auction,
    active,
  };
});

reducer.on(addToAuctionPassed, (auction, username) => {
  if (!auction) return null;

  return {
    ...auction,
    passed: [...auction.passed, username],
  };
});

reducer.on(endAuction, () => null);

export default reducer;
