import { getRepository, In } from "typeorm";
import { City } from "../../entity/City";
import { Map } from "../../entity/Map";
import { Connection } from "../../entity/Connection";

type PathHash = Record<number, Record<number, number>>;

const getCheapestPaths = (
  cities: City[],
  connections: Connection[]
): PathHash => {
  const cheapestPaths: Record<string, Record<string, number>> = {};

  const cityIds = cities.map(c => c.id);

  cities.forEach((origin) => {
    const unvisitedSet = new Set(cityIds);

    const tentativeDistances = cityIds.reduce<Record<string, number>>((acc, cityId) => {
      acc[cityId] = cityId === origin.id ? 0 : Infinity;
      return acc;
    }, {});

    while(unvisitedSet.size > 0) {
      const currentId = unvisitedSet.size === cityIds.length ?
        origin.id :
        Array.from(unvisitedSet)
          .reduce((acc, cityId) => tentativeDistances[cityId] < tentativeDistances[acc] ? cityId : acc);
  
      connections
        .filter((connection) => connection.cities.some(city => city.id === currentId))
        .filter((connection) => connection.cities.every(city => city.id === currentId || unvisitedSet.has(city.id)))
        .forEach((connection) => {
          const neighbor = connection.cities.find(city => city.id !== currentId);
  
          const distanceThroughCurrent = tentativeDistances[currentId] + connection.cost;
          tentativeDistances[neighbor.id] = Math.min(tentativeDistances[neighbor.id], distanceThroughCurrent);
        });
      
      unvisitedSet.delete(currentId);
    }

    cheapestPaths[origin.id] = tentativeDistances
  });

  return cheapestPaths;
}

export const getCityCostHelper = async (
  mapName: string,
  regions: number[]
): Promise<PathHash> => {
  const cityRepository = getRepository(City);
  const mapRepository = getRepository(Map);
  const connectionRepository = getRepository(Connection);

  const map: Map = await mapRepository.findOne({ where: { name: mapName } });
  
  const cities: City[] = await cityRepository.find({
    where: {
      map: map,
      region: In(regions)
    }
  });

  const cityIdSet = new Set(cities.map(city => city.id));

  const allConnections: Connection[] = await connectionRepository.find({
    where: { map },
    relations: ["cities"]
  });

  const connections = allConnections
    .filter(connection => connection.cities.every(city => cityIdSet.has(city.id)));

  return getCheapestPaths(cities, connections);
};
