import { getRepository } from "typeorm"
import { Player } from "../../entity/Player"
import { PlantInstance, PlantStatus } from "../../entity/PlantInstance";
import { Game, ActionType, Phase } from "../../entity/Game";
import { PlantPhaseEvent } from "../../entity/PlantPhaseEvent";
import { getTurnOrder } from "./getTurnOrder";

export const getAvailablePlants = (game: Game): PlantInstance[] => game
  .plants
  .filter(plantInstance => plantInstance.status === PlantStatus.MARKET)
  .sort((p, q) => p.plant.rank - q.plant.rank)
  .slice(0, game.era < 3 ? 4 : 6);

export const getNextPlayerInPlantPhase = (game: Game): Player => game
  .playerOrder
  .find((player) => game.plantPhaseEvents.every(p => p.id !== player.id));

export const recordPlantPhaseEvent = (game: Game, plantInstance: PlantInstance): void => {
  const event = new PlantPhaseEvent();
  event.game = game;
  event.turn = game.turn;
  event.player = game.activePlayer;
  event.plant = plantInstance;

  if (game.plantPhaseEvents) {
    game.plantPhaseEvents.push(event);
  } else {
    game.plantPhaseEvents = [event];
  }
};

export const drawPlantFromDeck = (game: Game): void => {
  if (game.turn === 1 && (!game.plantPhaseEvents || game.plantPhaseEvents.length === 0)) {
    const thirteen = game.plants.find(p => p.plant.rank === 13);
    thirteen.status = PlantStatus.MARKET;
  } else {
    // TODO: maybe start phase 3
    const deck = game.plants.filter(p => p.status === PlantStatus.DECK);
    const randomPlant = deck[Math.floor(Math.random() * deck.length)];
    randomPlant.status = PlantStatus.MARKET;
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

export const startResourcePhase = (game: Game): void => {
  if (game.turn === 1) {
    // recalc turn order on the first turn
    game.playerOrder = getTurnOrder(game);
  }

  if (game.plantPhaseEvents.every(event => !event.plant)) {
    // discard lowest plant from market
    const lowestPlant = game.plants
      .filter(p => p.status === PlantStatus.MARKET)
      .reduce<PlantInstance>((acc, p) => acc && acc.plant.rank < p.plant.rank ? acc : p, null);
    
    lowestPlant.status = PlantStatus.DISCARDED;
    drawPlantFromDeck(game);
  }

  game.phase = Phase.RESOURCE;
  game.activePlayer = game.playerOrder[game.playerOrder.length - 1];
  game.actionType = ActionType.BUY_RESOURCES;
};

export const obtainPlant = async (
  game: Game,
  plantInstance: PlantInstance,
  player: Player,
  cost: number
) => {
  const playerRepository = getRepository(Player);

  // give the plant to the player
  plantInstance.status = PlantStatus.OWNED;
  plantInstance.player = game.activePlayer;
  
  player.money -= cost;
  await playerRepository.save(player);
  
  recordPlantPhaseEvent(game, plantInstance);

  drawPlantFromDeck(game);
  
  // advance to next action
  if (mustDiscardPlant(game)) {
    game.actionType = ActionType.DISCARD_PLANT;
  } else if (game.plantPhaseEvents.length < game.playerOrder.length) {
    game.actionType = ActionType.PUT_UP_PLANT;
    game.activePlayer = getNextPlayerInPlantPhase(game);
  } else {
    startResourcePhase(game);
  }
}
