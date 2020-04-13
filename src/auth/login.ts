import { getRepository } from "typeorm";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { User } from "../entity/User";

interface LoginResponse {
  token: string;
  user: User;
}

export const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const userRepository = getRepository(User);

  const user = await userRepository.findOne({ username });

  if (!user) {
    throw new Error("Invalid login");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error("Invalid login");
  }

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username
    },
    process.env.LOGIN_SECRET,
    {
      expiresIn: "30d"
    }
  );

  return {
    token,
    user
  };
}