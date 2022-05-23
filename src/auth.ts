import * as jwt from 'jsonwebtoken'
import { AuthenticationError } from 'apollo-server';

const getUser = (authHeader: string) => {
  if (!authHeader) return null;

  const token = authHeader.replace('Bearer ', '');

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET as jwt.Secret);
    return user;
  } catch (err) {
    return null;
  }
};

const authMiddleware = (next: any) => (parent: any, args: any, context: any) => {
  if (!context.user) {
    throw new AuthenticationError("Your request does not contain a valid authorization header!");
  }

  return next(parent, args, context);
};

export { getUser, authMiddleware };