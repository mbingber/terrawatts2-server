import { Validator } from "./validator";
import { selectMe, selectMyMoney } from "../selectors/players.selectors";
import { selectTurn } from "../selectors/info.selectors";
import { selectAvailablePlants } from "../selectors/plants.selectors";
import { selectPlantMap } from "../selectors/props.selectors";
import { northernEuropeUraniumValidation } from './misc';

const putUpPlantValidators: Validator[] = [
  {
    validate: (_, state) => !state.auction,
    message: "Auction in progress",
  }, {
    validate: (_, state) => state.plantPhaseEvents.every(event => event.username !== selectMe(state)),
    message: "You already gained a plant or declined to put one up this turn",
  }, {
    validate: (move, state) => selectTurn(state) > 1 || !!move.plantId,
    message: "You cannot pass on turn 1",
  }, {
    validate: (move, state, context) => !move.plantId || selectAvailablePlants(state, context).includes(Number(move.plantId)),
    message: "Plant is unavailable",
  }, {
    validate: (move, state, context) => {
      if (!move.plantId) {
        return true;
      }

      const plant = selectPlantMap(state, context)[move.plantId];
      return !!move.bid && plant.rank <= move.bid;
    },
    message: "Bid must be at least plant's rank"
  }, {
    validate: (move, state) => !move.bid || selectMyMoney(state) >= move.bid,
    message: "You cannot afford this bid",
  },
  northernEuropeUraniumValidation
];

export default putUpPlantValidators;
