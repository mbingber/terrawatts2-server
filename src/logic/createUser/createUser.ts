import { Color, User } from "../../entity/User";
import { getRepository } from "typeorm";

export const createUser = async(
  username: string,
  preferredColor: Color,
  we: boolean
): Promise<User> => {
  const userRepository = getRepository(User);

  const user = new User();
  user.username = username;
  user.preferredColor = preferredColor;
  user.we = we;

  return userRepository.save(user);
}
