import {ApolloServer} from "apollo-server-express"
import express from 'express';
import typeDefs from './graphql/typeDefs';
import resolvers from "./graphql/resolvers";
import {PrismaClient} from '@prisma/client';
import cookieParser from "cookie-parser";
import cors from 'cors';
import {getUser} from "./auth";

async function startApolloServer() {
  const prisma = new PrismaClient();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    context: ({ req, res, ...rest }) => {
      const { refreshToken } = req.cookies;
      const user = getUser(refreshToken);

      return { req, res, prisma, user };
    },
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