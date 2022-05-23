import { ApolloError } from "apollo-server";
import { Context } from "../../../context";

export const user = {
  createUser: async (
      parent,
      args: { email: string, password: string, firstname: string, lastname?: string },
      ctx: Context
      ) => {
      const { email, password, firstname, lastname } = args;
      const isUserAlreadyExists = await ctx.prisma.user.findUnique({ where: { email }});

      if (isUserAlreadyExists) {
        return new ApolloError('A user with such an email is already registered!', 'USER_ALREADY_EXISTS');
      };

      return ctx.prisma.user.create({
        data: { email, password, firstname, lastname }
      });
    }
};

// this is example how to set cookie
// ctx.res.cookie('myCookie', 'textForCookie', {
//   httpOnly: true,
//   maxAge: 30 * 24 * 60 * 60 * 1000
// })