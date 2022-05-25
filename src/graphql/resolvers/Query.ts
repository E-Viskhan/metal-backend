import authMiddleware from "../../authMiddleware";
import { Context } from '../../types';

export const Query = {
  users: authMiddleware((parent, args, ctx: Context) => {
      return ctx.prisma.user.findMany();
    }),
    transactions: authMiddleware((parent, args, ctx: Context) => {
      return ctx.prisma.transaction.findMany();
    }),
    inventories: authMiddleware((parent, args, ctx: Context) => {
      return ctx.prisma.inventory.findMany();
    }),
    articles: authMiddleware((parent, args, ctx: Context) => {
      return ctx.prisma.article.findMany();
    })
};