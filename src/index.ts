import { ApolloServer, AuthenticationError } from "apollo-server"
import typeDefs from './graphql/typeDefs';
import resolvers from "./graphql/resolvers";
import * as jwt from 'jsonwebtoken'

const getUser = (token: string) => {
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET as jwt.Secret);
  } catch (err) {
    return { error: true, msg: "Session invalid" };
  }
};

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    context: ({ req }) => {
      const token = req.headers.authorization || '';
      const user = getUser(token);

      return { user };
    },
  });

  const { url } = await server.listen();

  console.log(`🚀 Server ready at ${url}`);
};

startApolloServer();