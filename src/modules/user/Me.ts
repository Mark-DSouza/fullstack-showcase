import { MyContext } from "../../types/MyContext";
import { User } from "../../entity/User";
import { Ctx, Query, Resolver } from "type-graphql";

@Resolver()
export class MeResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: MyContext): Promise<User | null> {
    if (!ctx.req.session.userId) {
      return null;
    }

    const user = await User.findOne({ where: { id: ctx.req.session.userId } });

    return user;
  }
}
