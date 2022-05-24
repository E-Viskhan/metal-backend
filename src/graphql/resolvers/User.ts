import { Context } from "../../types";

export const User = {
  transactions: (parent, args, ctx: Context) => {
    return ctx.prisma.transaction.findMany({
      where: { authorId: parent.id }
    });
  },
  inventories: (parent, args, ctx: Context) => {
    return ctx.prisma.inventory.findMany({
      where: {
        authorId: parent.id
      }
    })
  }
}