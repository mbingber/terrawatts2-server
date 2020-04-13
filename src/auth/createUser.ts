import { getRepository } from "typeorm";
import * as bcrypt from "bcryptjs";
import { Color, User } from "../entity/User";

export const createUser = async(
  username: string,
  password: string,
  preferredColor: Color,
  we: boolean
): Promise<User> => {
  const userRepository = getRepository(User);

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User();
  user.username = username;
  user.password = hashedPassword;
  user.preferredColor = preferredColor;
  user.we = we;

  return userRepository.save(user);
}
