import { Game, Phase, ActionType } from "../../entity/Game";
import { findGameById } from "../../queries/findGameById";
import { saveGame } from "../utils/saveGame";
import { PubSub } from "apollo-server";
import { savePlayer } from "../utils/savePlayer";
import { cityCost } from "./cityHelpers";
import { getMarketLength, getLowestRankInMarket, discardLowestPlant } from "../utils/plantHelpers";

export const buyCities = async (
  gameId: number,
  meId: number,
  cityInstanceIds: string[],
  cost: number,
  pubsub: PubSub
): Promise<Game> => {
  const game = await findGameById(gameId);
  
  if (!game) {
    throw new Error("ERROR: game not found");
  }

  if (meId !== game.activePlayer.id) {
    throw new Error("ERROR: not your turn");
  }

  if (game.phase !== Phase.CITY) {
    throw new Error("ERROR: incorrect phase");
  }

  if (game.actionType !== ActionType.BUY_CITIES) {
    throw new Error("ERROR: incorrect actionType");
  }

  if (game.activePlayer.money < cost) {
    throw new Error("ERROR: cannot afford cities");
  }

  let slotsAreOpen = true;
  let isOccupiedByMe = false;
  const cityIds = [];

  cityInstanceIds.forEach((cityInstanceId) => {
    const cityInstance = game.cities.find((c) => c.id === +cityInstanceId);
    if (cityInstance.players.length >= game.era) {
      slotsAreOpen = false;
    }

    if (cityInstance.players.some((p) => p.id === meId)) {
      isOccupiedByMe = true;
    }

    cityIds.push(cityInstance.city.id);
  });

  if (!slotsAreOpen) {
    throw new Error("ERROR: city slot not available");
  }

  if (isOccupiedByMe) {
    throw new Error("ERROR: you are already in this city");
  }

  const actualCost = await cityCost(game, cityIds);
  if (actualCost !== cost) {
    throw new Error("ERROR: incorrect cost");
  }

  const me = game.playerOrder.find((p) => p.id === meId);
  cityInstanceIds.forEach((cityInstanceId) => {
    const cityInstance = game.cities.find((c) => c.id === +cityInstanceId);
    cityInstance.players.push(me);
  });

  game.activePlayer.money -= cost;
  savePlayer(game.activePlayer, game);

  // potentially remove plants
  const numCities = game
    .cities
    .filter((city) => city.players.some((p) => p.id === game.activePlayer.id))
    .length;

  while (getLowestRankInMarket(game) <= numCities) {
    discardLowestPlant(game);
  }

  // TODO: abstract this? (almost identical to resource)
  const activePlayerIdx = game.playerOrder.findIndex(player => player.id === game.activePlayer.id);
  if (activePlayerIdx === 0) {
    // start power phase
    game.phase = Phase.POWER;
    game.actionType = ActionType.POWER_UP;
    game.activePlayer = game.playerOrder[0];

    if (getMarketLength(game) === 7) {
      game.era = 3;
    }
  } else {
    // advance to next player
    game.activePlayer = game.playerOrder[activePlayerIdx - 1];
  }

  return saveGame(game, pubsub);
};
