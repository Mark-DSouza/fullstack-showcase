import { MyContext } from "./../../types/MyContext";
import bcrypt from "bcrypt";
import { ChangePasswordInput } from "./changePassword/ChangePasswordInput";
import { User } from "../../entity/User";
import { redis } from "../../redis";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { forgotPasswordPrefix } from "../constants/redisPrefixes";

@Resolver()
export class ChangePasswordResolver {
  @Mutation(() => User, { nullable: true })
  async changePassword(
    @Arg("data") { token, password }: ChangePasswordInput,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const userId = await redis.get(forgotPasswordPrefix + token);

    if (!userId) {
      return null;
    }

    // await User.update({ id: parseInt(userId, 10) }, { password: hashedPassword });
    const user = await User.findOne({ where: { id: parseInt(userId, 10) } });
    if (!user) {
      return null;
    }

    user.password = await bcrypt.hash(password, 12);
    user.save(); // This is alternate way of updating an entity

    await redis.del(forgotPasswordPrefix + token);

    ctx.req.session.userId = user.id; // Log in the User

    return user;
  }
}
