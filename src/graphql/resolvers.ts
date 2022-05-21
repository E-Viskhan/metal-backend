import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const resolvers = {
  Query: {
    users: () => prisma.user.findMany(),
    transactions: () => prisma.transaction.findMany(),
    inventories: () => prisma.inventory.findMany(),
    articles: () => prisma.article.findMany()
  },
  Mutation: {
    createUser: (parent: any, args: { email: string, password: string, firstname: string }, context: any) => {
      const { email, password, firstname } = args;
      return prisma.user.create({ data: { email, password, firstname } })
    }
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