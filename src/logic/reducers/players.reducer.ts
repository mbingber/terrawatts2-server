import { createReducer } from "redux-act";
import { Player } from "../types/gameState";
import { addResourcesToPlayer, makePlayerMoney, setPlayerResources, setPlayers } from "../actions/players.actions";

const reducer = createReducer<Player[]>({}, null);

reducer.on(setPlayers, (_, players) => players);

reducer.on(addResourcesToPlayer, (players, { me, resources }) => players.map(player => {
  if (player.username !== me) {
    return player;
  }

  return {
    ...player,
    resources: {
      coal: player.resources.coal + resources.coal,
      oil: player.resources.oil + resources.oil,
      trash: player.resources.trash + resources.trash,
      uranium: player.resources.uranium + resources.uranium,
    },
  };
}));

reducer.on(makePlayerMoney, (players, { name, amount }) => players.map(player => {
  if (player.username !== name) {
    return player;
  }

  return {
    ...player,
    money: player.money + amount,
  };
}));

reducer.on(setPlayerResources, (players, { me, resources }) => players.map(player => {
  if (player.username !== me) {
    return player;
  }

  return {
    ...player,
    resources,
  };
}))

export default reducer;
