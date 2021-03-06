import { confirmUserPrefix } from './../constants/redisPrefixes';
import { redis } from "./../../redis";
import { v4 } from "uuid";

export const createConfirmationUrl = async (userId: number) => {
  const token = v4();

  await redis.set(confirmUserPrefix + token, userId, "EX", 60 * 60 * 24); // token expires in a day

  return `http://localhost:3000/user/confirm/${token}`;
};
