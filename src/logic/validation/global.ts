import { Validator } from "./validator";
import { selectMe } from "../selectors/players.selectors";
import { selectActionType } from "../selectors/info.selectors";
import { selectIsGameOver } from "../selectors/end.selectors";

const globalValidators: Validator[] = [
  {
    validate: (_, __, context) => !!context.game,
    message: "Game does not exist",
  }, {
    validate: (_, state, { user }) => selectMe(state) === user.username,
    message: "It is not your turn (or maybe you aren't playing this game)",
  }, {
    validate: (_, state) => !selectIsGameOver(state),
    message: "The game is over"
  }, {
    validate: (move, state) => selectActionType(state) === move.actionType,
    message: "Incorrect action type",
  }
];

export default globalValidators;
