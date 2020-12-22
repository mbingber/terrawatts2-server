import { getRepository } from "typeorm"
import { Plant } from "../entity/Plant"

export const fetchPlants = async () => {
  return getRepository(Plant).find();
}
