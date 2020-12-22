import { Phase, ActionType, Player, PlantInfo } from "../types/gameState";
import { createSelector } from "reselect";
import { selectActiveUser, selectPhase, selectPlantPhaseEvents, selectActionType, selectAuction, selectPlayerOrder, selectCities, selectPlants } from "./info.selectors";
import { selectPlantMap } from "./props.selectors";
import { Plant } from "../../entity/Plant";

const isFrontToBack: Record<Phase, boolean> = {
  [Phase.PLANT]: true,
  [Phase.RESOURCE]: false,
  [Phase.CITY]: false,
  [Phase.POWER]: true,
}

export const selectNumPlayers = createSelector(selectPlayerOrder, players => players.length);

const selectActiveTurnOrder = createSelector(
  [selectActiveUser, selectPlayerOrder],
  (activeUser, playerOrder) => playerOrder.findIndex(p => p.username === activeUser)
);

export const selectIsLastPlayer = createSelector(
  [selectActiveTurnOrder, selectPhase, selectNumPlayers, selectPlantPhaseEvents],
  (turnOrder, phase, numPlayers, events) => {
    if (phase === Phase.PLANT) {
      return events.length >= numPlayers;
    }
    
    return isFrontToBack[phase] ? turnOrder === numPlayers - 1 : turnOrder === 0;
  }
);

export const selectFirstPlayerInPhase = createSelector(
  [selectPhase, selectPlayerOrder],
  (phase, players) => isFrontToBack[phase] ? players[0].username : players[players.length - 1].username
);

export const selectNextPlayer = createSelector(
  [selectPhase, selectActiveTurnOrder, selectPlayerOrder, selectPlantPhaseEvents],
  (phase, turnOrder, players, events) => {
    if (phase === Phase.PLANT) {
      const player = players.find(p => events.every(e => e.username !== p.username)) as Player;
      return player.username;
    }
    
    return isFrontToBack[phase] ? players[turnOrder + 1].username : players[turnOrder - 1].username
  }
);

export const selectMe = createSelector(
  [selectActionType, selectActiveUser, selectAuction],
  (actionType, activeUser, auction) => (
    actionType === ActionType.BID_ON_PLANT && auction ? auction.active : activeUser
  )
);

const selectMyDetails = createSelector(
  [selectPlayerOrder, selectMe],
  (players, me) => players.find(p => p.username === me) as Player
);

export const selectMyResources = createSelector(selectMyDetails, details => details.resources);
export const selectMyMoney = createSelector(selectMyDetails, details => details.money);

const getNumCities = (cities: Record<string, string[]>, username: string): number => (
  Object.values(cities).filter(players => players.includes(username)).length
);

const getHighestPlant = (
  plants: Record<string, PlantInfo>,
  plantMap: Record<string, Plant>,
  username: string,
): number => (
  Object.keys(plants)
    .filter(plantId => plants[plantId].owner === username)
    .reduce<number>((acc, plantId) => Math.max(acc, plantMap[plantId].rank), 0)
);

export const selectNewTurnOrder = createSelector(
  [selectPlayerOrder, selectCities, selectPlants, selectPlantMap],
  (players, cities, plants, plantMap) => players.slice().sort(({ username: nameA }, { username: nameB }) => {
    const numCitiesA = getNumCities(cities, nameA);
    const numCitiesB = getNumCities(cities, nameB);

    if (numCitiesA > numCitiesB) {
      return -1;
    }

    if (numCitiesA < numCitiesB) {
      return 1;
    }

    return getHighestPlant(plants, plantMap, nameB) - getHighestPlant(plants, plantMap, nameA);
  })
);
