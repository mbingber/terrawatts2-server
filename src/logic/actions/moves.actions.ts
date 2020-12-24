import { purchaseResourcesFromMarket } from './resourceMarket.actions';
import { addResourcesToPlayer, chargePlayerMoney, setPlayerResources, makePlayerMoney } from './players.actions';
import { next } from './next.actions';
import { MoveThunk, Thunk } from '../types/thunks';
import { ActionType, PlantStatus } from '../types/gameState';
import { occupyCity, enforceCityPlantMarketRule } from './cities.actions';
import { startAuction, setAuctionBid, setAuctionLeader, setAuctionActiveUser, addToAuctionPassed, endAuction } from './auction.actions';
import { recordPlantPhaseEvent } from './plantPhaseEvents.actions';
import { setActionType } from './info.actions';
import { setPlantStatus, obtainPlant } from './plants.actions';
import { selectMe } from '../selectors/players.selectors';
import { selectGetsPlantAtFace, selectMyResourcesAfterDiscard } from '../selectors/plants.selectors';
import { selectNextAuctionBidder, selectIsAuctionOver } from '../selectors/auction.selectors';
import { selectAuction } from '../selectors/info.selectors';
import { selectResourcesAfterPowering, selectRevenue } from '../selectors/powerUp.selectors';
import { Move } from '../../entity/Move';

const putUpPlant: MoveThunk = ({ plantId, bid }) => (dispatch, getState) => {
  const me = selectMe(getState());

  if (!plantId || bid === undefined) {
    dispatch(recordPlantPhaseEvent({ username: me }))
    return dispatch(next());
  }

  const getsPlantAtFace = selectGetsPlantAtFace(getState());
  if (getsPlantAtFace) {
    dispatch(obtainPlant(plantId, bid, me));
  } else {
    const active = selectNextAuctionBidder(getState());
    dispatch(startAuction({
      plantId,
      bid,
      leader: me,
      active,
      passed: [],
    }));
    dispatch(setActionType(ActionType.BID_ON_PLANT));
  }
};

const bidOnPlant: MoveThunk = ({ bid }) => (dispatch, getState) => {
  const me = selectMe(getState());
  // figure out next bidder before passed array has been messed with
  const nextBidder = selectNextAuctionBidder(getState());

  if (bid) {
    dispatch(setAuctionBid(bid));
    dispatch(setAuctionLeader(me));
  } else {
    dispatch(addToAuctionPassed(me));
  }

  const auction = selectAuction(getState());
  const isOver = selectIsAuctionOver(getState());
  if (auction && isOver) {
    dispatch(endAuction());
    dispatch(setActionType(ActionType.PUT_UP_PLANT));
    dispatch(obtainPlant(auction.plantId, auction.bid, auction.leader));
  } else {
    dispatch(setAuctionActiveUser(nextBidder));
  }
};

const discardPlant: MoveThunk = ({ plantId, hybridChoice }) => (dispatch, getState, { plantList }) => {
  if (plantId === undefined) {
    return;
  }

  const me = selectMe(getState());

  dispatch(setPlantStatus({ plantId, status: PlantStatus.DISCARDED }));
  const resourcesAfterDiscard = selectMyResourcesAfterDiscard(getState(), { plantList, hybridChoice });
  dispatch(setPlayerResources({ resources: resourcesAfterDiscard, me }));
  dispatch(next());
}

const buyResources: MoveThunk = ({ resources, cost }) => (dispatch, getState) => {
  // TODO: better Move typing?
  if (!resources || cost === undefined) {
    return;
  }
  
  const me = selectMe(getState());
  
  dispatch(chargePlayerMoney({ name: me, amount: cost }));
  dispatch(purchaseResourcesFromMarket(resources));
  dispatch(addResourcesToPlayer({ me, resources }));
  dispatch(next());
}

const buyCities: MoveThunk = ({ cityIds, cost }) => (dispatch, getState) => {
  if (!cityIds || cost === undefined) {
    return;
  }

  const me = selectMe(getState());

  dispatch(chargePlayerMoney({ name: me, amount: cost }));
  cityIds.forEach(cityId => {
    dispatch(occupyCity({ me, cityId }));
  });

  dispatch(enforceCityPlantMarketRule());

  dispatch(next());
}

const powerUp: MoveThunk = ({ plantIds, hybridChoice }) => (dispatch, getState, { plantList }) => {
  if (!plantIds) {
    return;
  }
  
  const me = selectMe(getState());

  const resources = selectResourcesAfterPowering(getState(), { plantList, hybridChoice, plantIds });
  dispatch(setPlayerResources({ me, resources }));
  const amount = selectRevenue(getState(), { plantList, plantIds });
  dispatch(makePlayerMoney({ name: me, amount }));
  dispatch(next());
}

export const makeMove = (move: Move): Thunk => {
  const actionTypeToThunk: Record<ActionType, MoveThunk> = {
    [ActionType.PUT_UP_PLANT]: putUpPlant,
    [ActionType.BID_ON_PLANT]: bidOnPlant,
    [ActionType.DISCARD_PLANT]: discardPlant,
    [ActionType.BUY_RESOURCES]: buyResources,
    [ActionType.BUY_CITIES]: buyCities,
    [ActionType.POWER_UP]: powerUp,
  };

  return actionTypeToThunk[move.actionType](move);
}
