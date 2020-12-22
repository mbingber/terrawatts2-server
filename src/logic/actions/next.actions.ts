import { Thunk } from '../types/thunks';
import { advancePhase, setActiveUser, setEra, advanceTurn, setActionType } from './info.actions';
import { selectIsLastPlayer, selectNextPlayer, selectFirstPlayerInPhase, selectNumPlayers } from '../selectors/players.selectors';
import { selectTurn, selectPlantPhaseEvents, selectEra, selectPhase, selectActionType } from '../selectors/info.selectors';
import { discardLowestPlant, setChinaMarket, moveHighestPlantToEra3 } from './plants.actions';
import { selectPlantMarketLength } from '../selectors/plants.selectors';
import { setTurnOrder } from './players.actions';
import { Phase, ActionType } from '../types/gameState';
import { selectMaxNumCities } from '../selectors/cities.selectors';
import { numCitiesToStartEra2 } from '../utils/cityMilestones';
import { selectRestockedResourceMarket } from '../selectors/powerUp.selectors';
import { setResourceMarket } from './resourceMarket.actions';
import { clearPlantPhaseEvents } from './plantPhaseEvents.actions';

const endPlantPhase = (): Thunk => (dispatch, getState, { game }) => {
  const turn = selectTurn(getState());
  const events = selectPlantPhaseEvents(getState());

  if (turn === 1) {
    dispatch(setTurnOrder());
  }

  const everyonePassed = events.every(e => !e.plantId);
  if (game.map.name !== 'China' && everyonePassed) {
    dispatch(discardLowestPlant());
  }

  const era = selectEra(getState());
  if (era < 3 && game.map.name !== 'China' && selectPlantMarketLength(getState()) < 8) {
    dispatch(discardLowestPlant(true));
    dispatch(setEra(3));
  }
}

const endCityPhase = (): Thunk => (dispatch, getState, { game }) => {
  if (game.map.name !== 'China' && selectPlantMarketLength(getState()) < 8) {
    dispatch(setEra(3));
  }
}

const endTurn = (): Thunk => (dispatch, getState, { game }) => {
  const maxNumCities = selectMaxNumCities(getState());
  const numPlayers = selectNumPlayers(getState());

  if (selectEra(getState()) === 1 && maxNumCities >= numCitiesToStartEra2(numPlayers)) {
    dispatch(setEra(2));
    dispatch(discardLowestPlant());
  }

  //  in china, market stuff happens before resource restock (matters for era 3 start)
  if (game.map.name === 'China') {
    if (selectEra(getState()) === 3) {
      dispatch(discardLowestPlant());
    }
    dispatch(setChinaMarket());
  }

  const restockedMarket = selectRestockedResourceMarket(getState(), { game });
  dispatch(setResourceMarket(restockedMarket));

  if (game.map.name !== 'China') {
    // remove highest plant (or lowest plant if era3) and replace
    if (selectEra(getState()) === 3) {
      dispatch(discardLowestPlant());
    } else if (game.map.name !== 'China' && selectPlantMarketLength(getState()) === 8) {
      dispatch(moveHighestPlantToEra3());
    }

    // must recalc this, since moveHighestPlantToEra can change market length 
    if (selectPlantMarketLength(getState()) < 8) {
      dispatch(setEra(3));
    }
  }

  dispatch(setTurnOrder());
  dispatch(advanceTurn());
  dispatch(clearPlantPhaseEvents());
}

export const next = (): Thunk => (dispatch, getState) => {
  if (selectIsLastPlayer(getState())) {
    const phase = selectPhase(getState());
    if (phase === Phase.PLANT) {
      dispatch(endPlantPhase());
    } else if (phase === Phase.CITY) {
      dispatch(endCityPhase());
    } else if (phase === Phase.POWER) {
      dispatch(endTurn());
    }
    dispatch(advancePhase());
    const nextUser = selectFirstPlayerInPhase(getState());
    dispatch(setActiveUser(nextUser));
  } else {
    const nextUser = selectNextPlayer(getState());
    dispatch(setActiveUser(nextUser));

    if (selectPhase(getState()) === Phase.PLANT) {
      dispatch(setActionType(ActionType.PUT_UP_PLANT));
    }
  }
}
