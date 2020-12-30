import { createReducer } from '@reduxjs/toolkit';
import { Player } from '../types/gameState';
import { addResourcesToPlayer, makePlayerMoney, setPlayerResources, setPlayers } from '../actions/players.actions';

export default createReducer<Player[]>([], builder => {
  builder
    .addCase(setPlayers, (_, action) => action.payload)
    .addCase(addResourcesToPlayer, (state, action) => {
      const { me, resources } = action.payload;
      console.log("IN REDUCER!, addResourcesToPlayer", me, resources, state);
      const player = state.find(p => p.username === me);
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
    });
});
