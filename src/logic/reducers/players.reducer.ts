import { createReducer } from '@reduxjs/toolkit';
import { Player } from '../types/gameState';
import {
  addResourcesToPlayer,
  makePlayerMoney,
  setPlayerResources,
  setPlayers,
  recordSpend,
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
    .addCase(recordSpend, (state, action) => {
      const { me, amount, phase } = action.payload;
      const player = state.find(p => p.username === me);
      if (player) {
        // assumes you spend exactly once in each phase, which is true as of now
        // requires recording a spend of 0 when plant is passed on
        player.spendData[phase].push(amount);
      }
    });
});
