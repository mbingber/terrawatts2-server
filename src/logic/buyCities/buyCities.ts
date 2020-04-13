import { Game, Phase, ActionType } from "../../entity/Game";
import { savePlayer } from "../utils/savePlayer";
import { cityCost } from "./cityHelpers";
import { getMarketLength, getLowestRankInMarket, discardLowestPlant } from "../utils/plantHelpers";
import { Player } from "../../entity/Player";

interface BuyCitiesArgs {
  cityInstanceIds: string[];
  cost: number;
}

export const buyCities = async (
  game: Game,
  me: Player,
  args: BuyCitiesArgs
): Promise<Game> => {
  if (me.money < args.cost) {
    throw new Error("ERROR: cannot afford cities");
  }

  let slotsAreOpen = true;
  let isOccupiedByMe = false;
  const cityIds = [];

  args.cityInstanceIds.forEach((cityInstanceId) => {
    const cityInstance = game.cities.find((c) => c.id === +cityInstanceId);
    if (cityInstance.players.length >= game.era) {
      slotsAreOpen = false;
    }

    if (cityInstance.players.some((p) => p.id === me.id)) {
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
  if (actualCost !== args.cost) {
    throw new Error("ERROR: incorrect cost");
  }

  args.cityInstanceIds.forEach((cityInstanceId) => {
    const cityInstance = game.cities.find((c) => c.id === +cityInstanceId);
    cityInstance.players.push(me);
  });

  game.activePlayer.money -= args.cost;
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

    if (getMarketLength(game) < 8) {
      game.era = 3;
    }
  } else {
    // advance to next player
    game.activePlayer = game.playerOrder[activePlayerIdx - 1];
  }

  return game;
};
