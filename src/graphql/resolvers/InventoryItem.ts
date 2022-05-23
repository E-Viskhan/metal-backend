import { Context } from "../../context";

export const InventoryItem = {
  article: (parent, args, ctx: Context) => {
    return ctx.prisma.article.findUnique({
      where: {
        id: parent.articleId
      }
    })
  },
  inventory: (parent, args, ctx: Context) => {
    return ctx.prisma.inventory.findUnique({
      where: {
        id: parent.inventoryId
      }
    })
  },
  articleName: async (parent, args, ctx: Context) => {
    const article = await ctx.prisma.article.findUnique({
      where: {
        id: parent.articleId
      }
    });

    return article?.name;
  }
};