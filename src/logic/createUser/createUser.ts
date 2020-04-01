import { Color, User } from "../../entity/User";
import { getRepository } from "typeorm";

export const createUser = async(
  username: string,
  preferredColor: Color
): Promise<User> => {
  const userRepository = getRepository(User);

  const user = new User();
  user.username = username;
  user.preferredColor = preferredColor;

  return userRepository.save(user);
}
