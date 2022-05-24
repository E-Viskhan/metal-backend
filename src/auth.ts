import * as jwt from 'jsonwebtoken'
import { AuthenticationError } from 'apollo-server-express';
import {User} from "./types";

const getUser = (refreshToken: string) => {
  if (!refreshToken) return null;
  // const tokenPart = refreshToken.replace('Bearer ', '');

  try {
    const {id, email} = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET) as User;

    return { id, email };
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