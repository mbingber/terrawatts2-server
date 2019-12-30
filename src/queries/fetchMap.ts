import { getRepository } from "typeorm";
import { Map } from "../entity/Map";

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
