import { Context } from "../../types";

export const Article = {
  transactions: (parent, args, ctx: Context) => {
    return ctx.prisma.transaction.findMany({
      where: {
        articleId: parent.id
      }
    })
  },
  inventoryItems: (parent, args, ctx: Context) => {
    return ctx.prisma.inventoryItem.findMany({
      where: {
        articleId: parent.id
      }
    })
  }
};