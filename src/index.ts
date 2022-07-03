import express from "express";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { RegisterResolver } from "./modules/user/Register";
import { LoginResolver } from "./modules/user/Login";
import { MeResolver } from "./modules/user/Me";
import session from "express-session";
import connectRedis from "connect-redis";
import Redis from "ioredis";
import cors from "cors";
import { MyContext } from "./types/MyContext";

const AppDataSource = new DataSource({
  name: "default",
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "fullstack_showcase",
  synchronize: true,
  logging: true,
  entities: ["src/entity/*.*"],
});

const main = async () => {
  await AppDataSource.initialize();

  const schema = await buildSchema({
    resolvers: [RegisterResolver, LoginResolver, MeResolver],
    authChecker: ({ context: { req } }) => {
      return !!req.session.userId;
    },
  });

  const server = new ApolloServer({
    schema,
    context: ({ req }: MyContext) => ({ req }),
  });

  const app = express();

  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000",
    })
  );

  const RedisStore = connectRedis(session);
  const redisClient = new Redis();

  app.use(
    session({
      store: new RedisStore({
        client: redisClient,
      }),
      name: "qid",
      secret: "asdfghjkl;",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
      },
    })
  );

  server.applyMiddleware({ app });

  app.listen(4000, () =>
    console.log("App is running on https://localhost:4000/graphql")
  );
};

main();
