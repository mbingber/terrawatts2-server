import { getRepository } from "typeorm";
import { User } from "../entity/User";

export const getCurrentUser = async (user) => {
  if (!user) {
    throw new Error("Not authenticated");
  }

  const userRepository = getRepository(User);

  return userRepository.findOne(user.id);
}