import { Context } from "../../types";

export const Transaction = {
  author: (parent, args, ctx: Context) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: parent.authorId
      }
    })
  },
  article: (parent, args, ctx: Context) => {
    return ctx.prisma.article.findUnique({
      where: {
        id: parent.articleId
      }
    })
  },
  articleName: async (parent, args, ctx: Context) => {
    const article = await ctx.prisma.article.findUnique({
      where: {
        id: parent.articleId
      }
    });

    return article?.name
  }
};