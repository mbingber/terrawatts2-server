import { Validator } from "./validator";
import { selectMustDiscardPlant, selectPlayerPlantIds } from "../selectors/plants.selectors";
import { ActionType } from "../types/gameState";

const discardPlantValidators: Validator[] = [
  {
    validate: (_, state) => selectMustDiscardPlant(state, {}),
    message: "You don't have to discard",
  }, {
    validate: (move, state) => !!move.plantId && selectPlayerPlantIds(state, {}).includes(move.plantId),
    message: "You don't have that plant",
  }, {
    validate: (move, _, { game }) => {
      const lastPutUpPlantMove = game
        .moves
        .slice()
        .reverse()
        .find(move => move.actionType === ActionType.PUT_UP_PLANT);

      return !!lastPutUpPlantMove && !!lastPutUpPlantMove.plantId && lastPutUpPlantMove.plantId !== move.plantId;
    },
    message: "You just bought that plant",
  }, {
    // TODO
    validate: () => true,
    message: "You did not need to provide hybrid choice",
  }, {
    validate: () => true,
    message: "You needed to provide hybrid choice",
  }, {
    validate: () => true,
    message: "Your hybrid choice is invalid",
  }, 
];

export default discardPlantValidators;
