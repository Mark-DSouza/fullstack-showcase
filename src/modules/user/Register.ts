import {
  Arg,
  Authorized,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { User } from "../../entity/User";
import * as bcrypt from "bcrypt";
import { RegisterInput } from "./register/RegisterInput";

import { isAuth } from "./../middleware/isAuth";
import { logger } from "../middleware/logger";

@Resolver()
export class RegisterResolver {
  @UseMiddleware(isAuth, logger)
  @Authorized()
  @Query(() => String)
  async hello() {
    return "Hello, World!";
  }

  @Mutation(() => User)
  async register(@Arg("input") registerInput: RegisterInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(registerInput.password, 12);
    const user = new User();
    user.firstName = registerInput.firstName;
    user.lastName = registerInput.lastName;
    user.email = registerInput.email;
    user.password = hashedPassword;

    await user.save();
    return user;
  }
}
