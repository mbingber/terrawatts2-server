import { createReducer } from '@reduxjs/toolkit';
import { Auction } from '../types/gameState';
import { startAuction, setAuctionBid, setAuctionLeader, setAuctionActiveUser, addToAuctionPassed, endAuction } from '../actions/auction.actions';

export default createReducer<Auction | null>(null, builder => {
  builder
    .addCase(startAuction, (_, action) => action.payload)
    .addCase(setAuctionBid, (state, action) => {
      if (state) { state.bid = action.payload; }
    })
    .addCase(setAuctionLeader, (state, action) => {
      if (state) { state.leader = action.payload; }
    })
    .addCase(setAuctionActiveUser, (state, action) => {
      if (state) { state.active = action.payload; }
    })
    .addCase(addToAuctionPassed, (state, action) => {
      if (state) { state.passed.push(action.payload); }
    })
    .addCase(endAuction, () => null)
});
