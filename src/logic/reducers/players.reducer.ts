import { createReducer } from '@reduxjs/toolkit';
import { Player } from '../types/gameState';
import {
  addResourcesToPlayer,
  makePlayerMoney,
  setPlayerResources,
  setPlayers,
  recordPlantSpend,
  recordResourceSpend,
  recordCitySpend,
  recordEarn,
} from '../actions/players.actions';

export default createReducer<Player[]>([], builder => {
  builder
    .addCase(setPlayers, (_, action) => action.payload)
    .addCase(addResourcesToPlayer, (state, action) => {
      const { me, resources } = action.payload;
      const player = state.find(p => {
        return p.username === me
      });
      if (player) {
        player.resources.coal += resources.coal;
        player.resources.oil += resources.oil;
        player.resources.trash += resources.trash;
        player.resources.uranium += resources.uranium;
      }
    })
    .addCase(makePlayerMoney, (state, action) => {
      const { name, amount } = action.payload;
      const player = state.find(p => p.username === name);
      if (player) {
        player.money += amount;
      }
    })
    .addCase(setPlayerResources, (state, action) => {
      const { me, resources } = action.payload;
      const player = state.find(p => p.username === me);
      if (player) {
        player.resources = resources;
      }
    })
    .addCase(recordPlantSpend, (state, action) => {
      const { me, amount } = action.payload;
      const player = state.find(p => p.username === me);
      if (player) {
        player.totalPlantSpend += amount;
      }
    })
    .addCase(recordResourceSpend, (state, action) => {
      const { me, amount } = action.payload;
      const player = state.find(p => p.username === me);
      if (player) {
        player.totalResourceSpend += amount;
      }
    })
    .addCase(recordCitySpend, (state, action) => {
      const { me, amount } = action.payload;
      const player = state.find(p => p.username === me);
      if (player) {
        player.totalCitySpend += amount;
      }
    })
    .addCase(recordEarn, (state, action) => {
      const { me, amount } = action.payload;
      const player = state.find(p => p.username === me);
      if (player) {
        player.totalEarn += amount;
      }
    });
});
