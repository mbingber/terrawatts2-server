import { Validator } from './validator';
import { selectMyCities } from '../selectors/cities.selectors';
import { selectMapName, selectPlantMap, selectCityDataMap } from '../selectors/props.selectors';
import { PlantResourceType } from '../../entity/Plant';

export const northernEuropeUraniumValidation: Validator = {
  validate: (move, state, context) => {
    if (!move.plantId) {
      return true;
    }
    
    const mapName = selectMapName(state, context);
    const plant = selectPlantMap(state, context)[move.plantId];
    const cityMap = selectCityDataMap(state, context);
    const myCities = selectMyCities(state);
    
    if (plant.resourceType !== PlantResourceType.URANIUM) {
      return true;
    }
    
    if (mapName !== "Northern Europe") {
      return true;
    }

    return myCities.some(cityId => cityMap[cityId].region > 2);
  },
  message: "You cannot bid on a nuclear plant with your current cities",
};
