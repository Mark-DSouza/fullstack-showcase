import express from "express";
import { Query, Resolver, buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import "reflect-metadata";

@Resolver()
class HelloResolver {
  @Query(() => String)
  async hello() {
    return "Hello, World!";
  }
}

const main = async () => {
  const schema = await buildSchema({
    resolvers: [HelloResolver],
  });

  const server = new ApolloServer({ schema });
  const app = express();
  server.applyMiddleware({ app });

  app.listen(4000, () =>
    console.log("App is running on https://localhost:4000/graphql")
  );
};

main();
