import { Player } from "../../entity/Player"
import { PlantInstance, PlantStatus } from "../../entity/PlantInstance";
import { Game, ActionType, Phase } from "../../entity/Game";
import { PlantPhaseEvent } from "../../entity/PlantPhaseEvent";
import { getTurnOrder } from "./getTurnOrder";
import { savePlayer } from "./savePlayer";

export const getAvailablePlants = (game: Game): PlantInstance[] => game
  .plants
  .filter(plantInstance => plantInstance.status === PlantStatus.MARKET)
  .sort((p, q) => p.plant.rank - q.plant.rank)
  .slice(0, game.era < 3 ? 4 : 6);

export const getNextPlayerInPlantPhase = (game: Game): Player => game
  .playerOrder
  .find((player) => game.plantPhaseEvents.every(p => p.player.id !== player.id));

export const recordPlantPhaseEvent = (game: Game, plantInstance: PlantInstance): void => {
  const event = new PlantPhaseEvent();
  event.game = game;
  event.turn = game.turn;
  event.player = game.auction ? game.auction.leadingPlayer : game.activePlayer;
  event.plant = plantInstance;

  if (game.plantPhaseEvents) {
    game.plantPhaseEvents.push(event);
  } else {
    game.plantPhaseEvents = [event];
  }
};

export const startEra3 = (game: Game): void => {
  game.plants.forEach((plantInstance) => {
    if (plantInstance.status === PlantStatus.ERA_THREE) {
      plantInstance.status = PlantStatus.DECK;
    }
  });
  
  if (game.phase === Phase.CITY) {
    discardLowestPlant(game, true);
  }
  
  if (game.phase === Phase.POWER) {
    discardLowestPlant(game, true);
    game.era = 3;
  }
}

export const drawPlantFromDeck = (game: Game): void => {
  if (game.turn === 1 && (!game.plantPhaseEvents || game.plantPhaseEvents.length === 0)) {
    const thirteen = game.plants.find(p => p.plant.rank === 13);
    thirteen.status = PlantStatus.MARKET;
  } else {
    const deck = game.plants.filter(p => p.status === PlantStatus.DECK);
    if (deck.length === 0 && game.era !== 3) {
      startEra3(game);
    } else if (deck.length > 0) {
      const randomPlant = deck[Math.floor(Math.random() * deck.length)];
      randomPlant.status = PlantStatus.MARKET;
    }
  }
}

export const getOwnedPlantInstances = (game: Game, player: Player): PlantInstance[] => game
  .plants
  .filter(plant => (
    plant.status === PlantStatus.OWNED &&
    plant.player &&
    plant.player.id === player.id
  ));

export const mustDiscardPlant = (game: Game): boolean => {
  const maxPlants = game.playerOrder.length === 2 ? 4 : 3;
  const ownedPlants = getOwnedPlantInstances(game, game.activePlayer);

  return ownedPlants.length > maxPlants;
};

export const discardLowestPlant = (game: Game, suppressDraw: boolean = false): void => {
  const lowestPlant = game.plants
    .filter(p => p.status === PlantStatus.MARKET)
    .reduce<PlantInstance>((acc, p) => acc && acc.plant.rank < p.plant.rank ? acc : p, null);

  lowestPlant.status = PlantStatus.DISCARDED;

  if (!suppressDraw) {
    drawPlantFromDeck(game);
  }
}

export const moveHighestPlantToEra3 = (game: Game): void => {
  const highestPlant = game.plants
    .filter(p => p.status === PlantStatus.MARKET)
    .reduce<PlantInstance>((acc, p) => acc && acc.plant.rank > p.plant.rank ? acc : p, null);

  highestPlant.status = PlantStatus.ERA_THREE;
  drawPlantFromDeck(game);
}

export const startResourcePhase = (game: Game): void => {
  if (game.turn === 1) {
    // recalc turn order on the first turn
    game.playerOrder = getTurnOrder(game);
  }

  if (game.plantPhaseEvents.every(event => !event.plant)) {
    discardLowestPlant(game);
  }

  if (getMarketLength(game) === 7) {
    discardLowestPlant(game, true);
    game.era = 3;
  }

  game.phase = Phase.RESOURCE;
  game.activePlayer = game.playerOrder[game.playerOrder.length - 1];
  game.actionType = ActionType.BUY_RESOURCES;
};

export const obtainPlant = (
  game: Game,
  plantInstance: PlantInstance,
  player: Player,
  cost: number
) => {
  // give the plant to the player
  plantInstance.status = PlantStatus.OWNED;
  plantInstance.player = player;
  
  player.money -= cost;
  savePlayer(player, game);
  
  drawPlantFromDeck(game);
  recordPlantPhaseEvent(game, plantInstance);
  
  // advance to next action
  if (mustDiscardPlant(game)) {
    game.actionType = ActionType.DISCARD_PLANT;
    game.activePlayer = player;
    game.plantRankBought = plantInstance.plant.rank;
  } else if (game.plantPhaseEvents.length < game.playerOrder.length) {
    game.actionType = ActionType.PUT_UP_PLANT;
    game.activePlayer = getNextPlayerInPlantPhase(game);
  } else {
    startResourcePhase(game);
  }
}

export const getMarketLength = (game: Game): number => {
  return game.plants.filter((plant) => plant.status === PlantStatus.MARKET).length;
}

export const getLowestRankInMarket = (game: Game): number => {
  const market = game
    .plants
    .filter((plant) => plant.status === PlantStatus.MARKET)
    .sort((a, b) => a.plant.rank - b.plant.rank);

  if (market.length === 0) {
    return Infinity;
  }

  return market[0].plant.rank;
}
