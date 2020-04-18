import { getRepository } from "typeorm";
import * as bcrypt from "bcryptjs";
import { User } from "../entity/User";

export const setPassword = async(
  username: string,
  password: string
): Promise<User> => {
  const userRepository = getRepository(User);

  const user = await userRepository.findOne({ username });

  if (!user) {
    throw new Error("User not found");
  }
  
  if (user.password) {
    throw new Error("This user already has a password");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;

  return userRepository.save(user);
}
