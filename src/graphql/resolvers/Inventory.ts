import {Context} from '../../types';
import {db} from "../../db";

export const Inventory = {
    inventoryItems: (parent, args, ctx: Context) => {
        return db.inventoryItem.findMany({
            where: {
                inventoryId: parent.id
            }
        })
    },
    author: (parent, args, ctx: Context) => {
        return db.user.findUnique({
            where: {
                id: parent.authorId
            }
        })
    },
}