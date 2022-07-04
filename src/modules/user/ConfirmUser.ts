import { confirmUserPrefix } from "./../constants/redisPrefixes";
import { User } from "../../entity/User";
import { redis } from "../../redis";
import { Arg, Mutation, Resolver } from "type-graphql";

@Resolver()
export class ConfirmUserResolver {
  @Mutation(() => Boolean)
  async confirmUser(@Arg("token") token: string): Promise<boolean> {
    const userId = await redis.get(confirmUserPrefix + token);

    if (!userId) {
      return false;
    }

    await User.update({ id: parseInt(userId, 10) }, { confirmed: true });
    await redis.del(confirmUserPrefix + token);

    return true;
  }
}
