import { RegisterInput } from "./register/RegisterInput";
import { User } from "../../entity/User";
import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import * as bcrypt from "bcrypt";

@Resolver()
export class RegisterResolver {
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
