import { Context } from '../../types';

export const Inventory = {
  inventoryItems: (parent, args, ctx: Context) => {
    return ctx.prisma.inventoryItem.findMany({
      where: {
        inventoryId: parent.id
      }
    })
  },
  author: (parent, args, ctx: Context) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: parent.authorId
      }
    })
  },
}