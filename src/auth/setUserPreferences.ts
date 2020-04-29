import { getRepository } from "typeorm";
import { User, Color } from "../entity/User";

export const setUserPreferences = async(
  user: User,
  preferredColor: Color,
  we: boolean
): Promise<User> => {
  const userRepository = getRepository(User);

  if (!user) {
    throw new Error("Not authenticated");
  }
  
  if (preferredColor) {
    user.preferredColor = preferredColor;
  }

  if (we) {
    user.we = we;
  }

  return userRepository.save(user);
}
