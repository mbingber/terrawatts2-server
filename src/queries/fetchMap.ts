import { getRepository } from "typeorm";
import { Map } from "../entity/Map";
import { City } from "../entity/City";

export const fetchMap = async (
  mapName: string,
  regions: number[] = [1, 2, 3, 4, 5, 6]
): Promise<Map> => {
  return getRepository(Map)
    .createQueryBuilder("map")
    .leftJoinAndSelect("map.cities", "city")
    .leftJoinAndSelect("map.connections", "connection")
    .leftJoinAndSelect("connection.cities", "connectionCity")
    .where("map.name = :name", { name: mapName })
    .andWhere("city.region IN (:...regions)", { regions })
    .getOne();
}

type CityInput = {
  id: number;
  lat: number;
  lng: number;
}

type MapInput = {
  id: number;
  name: string;
  cities: CityInput[];
}

export const saveMap = async (mapInput: MapInput): Promise<Map> => {
  const cityRepository = getRepository(City);

  const cityLookup = mapInput.cities.reduce<Record<number, CityInput>>((acc, city) => {
    acc[city.id] = city;
    return acc;
  }, {});
  
  const cities = await cityRepository
    .createQueryBuilder("city")
    .where("city.id IN (:...cityIds)", { cityIds: mapInput.cities.map(c => c.id) })
    .getMany();

  cities.forEach((city) => {
    const changes = cityLookup[city.id];
    if (changes) {
      if (!city.originalLat) city.originalLat = city.lat;
      if (!city.originalLng) city.originalLng = city.lng;
      city.lat = changes.lat;
      city.lng = changes.lng;
    }
  });

  await cityRepository.save(cities);

  return fetchMap(mapInput.name);
};
