import { User } from "../../entity/User";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import * as bcrypt from "bcrypt";

@Resolver()
export class RegisterResolver {
  @Query(() => String)
  async hello() {
    return "Hello, World!";
  }

  @Mutation(() => User)
  async register(
    @Arg("firstName") firstName: string,
    @Arg("lastName") lastName: string,
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.password = hashedPassword;

    await user.save();
    return user;
  }
}
