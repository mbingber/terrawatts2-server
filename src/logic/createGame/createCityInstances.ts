import { getRepository, In } from 'typeorm';
import { CityInstance } from '../../entity/CityInstance';
import { City } from '../../entity/City';
import { Map } from '../../entity/Map';

export const createCityInstances = async (map: Map, regions: number[]): Promise<CityInstance[]> => {
  const cityRepository = getRepository(City);
  
  const cities: City[] = await cityRepository.find({
    where: {
      map: map,
      region: In(regions)
    }
  });

  const cityInstances: CityInstance[] = cities.map(city => {
    const cityInstance = new CityInstance();
    cityInstance.city = city;
    return cityInstance;
  });
  
  return cityInstances;
}
