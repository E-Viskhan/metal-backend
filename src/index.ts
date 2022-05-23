import { ApolloServer } from "apollo-server"
import typeDefs from './graphql/typeDefs';
import resolvers from "./graphql/resolvers";
import { getUser } from './auth';


async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cors: true,
    context: ({ req, res }) => {
      const authHeader = req.headers.authorization || '';
      const user = getUser(authHeader);

      return { user, req, res };
    },
  });

  const { url } = await server.listen();

  console.log(`🚀 Server ready at ${url}`);
};

startApolloServer();