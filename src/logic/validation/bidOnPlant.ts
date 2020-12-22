import { Validator } from "./validator";
import { northernEuropeUraniumValidation } from "./misc";
import { selectAuctionBid } from "../selectors/auction.selectors";
import { selectMyMoney } from "../selectors/players.selectors";

const bidOnPlantValidators: Validator[] = [
  {
    validate: (_, state) => !!state.auction,
    message: "There is no auction in progress",
  }, {
    validate: ({ bid }, state) => (!bid && bid !== 0) || bid > selectAuctionBid(state),
    message: "Bid is too low",
  }, {
    validate: ({ bid }, state) => (!bid && bid !== 0) || bid <= selectMyMoney(state),
    message: "You can't afford the bid",
  },
  northernEuropeUraniumValidation,
];

export default bidOnPlantValidators;
