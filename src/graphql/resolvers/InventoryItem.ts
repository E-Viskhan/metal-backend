import {Context} from "../../types";
import {db} from "../../db";

export const InventoryItem = {
    article: (parent, args, ctx: Context) => {
        return db.article.findUnique({
            where: {
                id: parent.articleId
            }
        })
    },
    inventory: (parent, args, ctx: Context) => {
        return db.inventory.findUnique({
            where: {
                id: parent.inventoryId
            }
        })
    },
    articleName: async (parent, args, ctx: Context) => {
        const article = await db.article.findUnique({
            where: {
                id: parent.articleId
            }
        });

        return article?.name;
    }
};