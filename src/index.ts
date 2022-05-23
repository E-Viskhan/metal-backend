import { ApolloServer } from "apollo-server"
import typeDefs from './graphql/typeDefs';
import resolvers from "./graphql/resolvers";
import { getUser } from './auth';
import { PrismaClient } from '@prisma/client';


async function startApolloServer() {
  const prisma = new PrismaClient();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cors: true,
    context: ({ req, res, ...rest }) => {
      const authHeader = req.headers.authorization || '';
      const user = getUser(authHeader);

      return { req, res, prisma, user };
    },
  });

  const { url } = await server.listen();

  console.log(`🚀 Server ready at ${url}`);
};

startApolloServer();