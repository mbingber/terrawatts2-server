import { createAction } from '@reduxjs/toolkit';
import { Auction } from '../types/gameState';

export const startAuction = createAction<Auction>('Start auction');
export const setAuctionBid = createAction<number>('Set auction bid');
export const setAuctionLeader = createAction<string>('Set auction leader');
export const setAuctionActiveUser = createAction<string>('Set auction active');
export const addToAuctionPassed = createAction<string>('Add to auction passed');
export const endAuction = createAction('End auction');
