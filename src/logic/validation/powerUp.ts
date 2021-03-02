import { Validator } from "./validator";
import { selectPlayerPlantIds } from "../selectors/plants.selectors";
import { selectHybridChoiceNeeded, selectResourcesNeededToPower, selectResourcesAfterPowering } from "../selectors/powerUp.selectors";

const powerUpValidators: Validator[] = [
  {
    validate: ({ plantIds }, state) => {
      if (!plantIds) {
        return true
      }

      const myPlantIds = selectPlayerPlantIds(state, {});
      return plantIds.every(plantId => myPlantIds.includes(plantId));
    },
    message: "You don't own one or more of those plants",
  }, {
    validate: ({ plantIds, hybridChoice }, state, { plantList }) => {
      const resourcesAfterPowering = selectResourcesAfterPowering(state, { plantIds, hybridChoice, plantList });
      return Object.values(resourcesAfterPowering).every(val => val >= 0);
    },
    message: "You don't have enough resources",
  }, {
    validate: ({ plantIds, hybridChoice }, state, { plantList }) => {
      const choiceNeeded = selectHybridChoiceNeeded(state, { plantIds, plantList });
      return !hybridChoice || choiceNeeded;
    },
    message: "You did not need to provide hybrid choice",
  }, {
    validate: ({ plantIds, hybridChoice }, state, { plantList }) => {
      const choiceNeeded = selectHybridChoiceNeeded(state, { plantIds, plantList });
      return !!hybridChoice || !choiceNeeded;
    },
    message: "You needed to provide hybrid choice",
  }, {
    validate: ({ plantIds, hybridChoice }, state, { plantList }) => {
      if (!hybridChoice) {
        return true;
      }

      const needed = selectResourcesNeededToPower(state, { plantIds, plantList });
      return needed.HYBRID === hybridChoice.coal + hybridChoice.oil;
    },
    message: "Your hybrid choice is invalid",
  },
];

export default powerUpValidators;
