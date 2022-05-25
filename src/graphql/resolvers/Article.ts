import {Context} from "../../types";
import {db} from "../../db";

export const Article = {
    transactions: (parent, args, ctx: Context) => {
        return db.transaction.findMany({
            where: {
                articleId: parent.id
            }
        })
    },
    inventoryItems: (parent, args, ctx: Context) => {
        return db.inventoryItem.findMany({
            where: {
                articleId: parent.id
            }
        })
    }
};