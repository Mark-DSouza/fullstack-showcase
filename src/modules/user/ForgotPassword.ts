import { forgotPasswordPrefix } from "./../constants/redisPrefixes";
import { User } from "../../entity/User";
import { redis } from "../../redis";
import { Arg, Mutation, Resolver } from "type-graphql";
import { v4 } from "uuid";
import { sendEmail } from "../utils/sendEmail";

@Resolver()
export class ForgotPasswordResolver {
  @Mutation(() => Boolean)
  async forgotPassword(@Arg("email") email: string): Promise<boolean> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return true; // We don't want to indicate to phishers if the email exists
      // You could probably console.log to see if it works
    }

    const token = v4();
    await redis.set(forgotPasswordPrefix + token, user.id, "EX", 60 * 60 * 24); // token expires in a day

    await sendEmail(user?.email, `http://localhost:3000/user/confirm/${token}`);

    return true;
  }
}
