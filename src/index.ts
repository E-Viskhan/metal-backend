import {ApolloServer} from "apollo-server-express"
import express from 'express';
import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";
import cookieParser from "cookie-parser";
import cors from 'cors';
import {initDB} from "./db";

async function startApolloServer() {
  initDB();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    context: ({ req, res }) => ({ req, res })
  });

  await server.start()

  const app = express();
  app.use(cookieParser());
  app.use(cors())
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
      console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
}

startApolloServer();