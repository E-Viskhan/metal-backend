import { PrismaClient } from "@prisma/client";
import { ApolloError } from "apollo-server";
import { authMiddleware } from "../auth";

const prisma = new PrismaClient();

const resolvers = {
  Query: {
    users: authMiddleware((parent: any, args: any, context: any) => {
      return prisma.user.findMany();
    }),
    transactions: authMiddleware((parent: any, args: any, context: any) => {
      return prisma.transaction.findMany();
    }),
    inventories: authMiddleware((parent: any, args: any, context: any) => {
      return prisma.inventory.findMany();
    }),
    articles: authMiddleware((parent: any, args: any, context: any) => {
      return prisma.article.findMany();
    })
  },
  Mutation: {
    createUser: async (
      parent: any,
      args: { email: string, password: string, firstname: string, lastname?: string },
      context: any
      ) => {
      const { email, password, firstname, lastname } = args;
      context.res.cookie('myCookie', 'textForCookie', {
        httpOnly: true
      })

      const isUserAlreadyExists = await prisma.user.findUnique({
        where: {
          email
        }
      });

      if (isUserAlreadyExists) {
        return new ApolloError('A user with such an email is already registered!', 'USER_ALREADY_EXISTS')
      };

      return prisma.user.create({
        data: { email, password, firstname, lastname }
      });
    },

  },
  User: {
    transactions: (parent: any) => {
      return prisma.transaction.findMany({
        where: { authorId: parent.id }
      });
    },
    inventories: (parent: any) => {
      return prisma.inventory.findMany({
        where: {
          authorId: parent.id
        }
      })
    }
  },
  Inventory: {
    inventoryItems: (parent: any) => {
      return prisma.inventoryItem.findMany({
        where: {
          inventoryId: parent.id
        }
      })
    },
    author: (parent: any) => {
      return prisma.user.findUnique({
        where: {
          id: parent.authorId
        }
      })
    },
  },
  InventoryItem: {
    article: (parent: any) => {
      return prisma.article.findUnique({
        where: {
          id: parent.articleId
        }
      })
    },
    inventory: (parent: any) => {
      return prisma.inventory.findUnique({
        where: {
          id: parent.inventoryId
        }
      })
    },
    articleName: async (parent: any) => {
      const article = await prisma.article.findUnique({
        where: {
          id: parent.articleId
        }
      });

      return article?.name;
    }
  },
  Transaction: {
    author: (parent: any) => {
      return prisma.user.findUnique({
        where: {
          id: parent.authorId
        }
      })
    },
    article: (parent: any) => {
      return prisma.article.findUnique({
        where: {
          id: parent.articleId
        }
      })
    },
    articleName: async (parent: any) => {
      const article = await prisma.article.findUnique({
        where: {
          id: parent.articleId
        }
      });

      return article?.name
    }
  },
  Article: {
    transactions: (parent: any) => {
      return prisma.transaction.findMany({
        where: {
          articleId: parent.id
        }
      })
    },
    inventoryItems: (parent: any) => {
      return prisma.inventoryItem.findMany({
        where: {
          articleId: parent.id
        }
      })
    }
  }
};

export default resolvers;