import express from "express";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { RegisterResolver } from "./modules/user/Register";

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
    resolvers: [RegisterResolver],
  });

  const server = new ApolloServer({ schema });
  const app = express();
  server.applyMiddleware({ app });

  app.listen(4000, () =>
    console.log("App is running on https://localhost:4000/graphql")
  );
};

main();
