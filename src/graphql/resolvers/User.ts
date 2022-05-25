import {Context} from "../../types";
import {db} from "../../db";

export const User = {
    transactions: (parent, args, ctx: Context) => {
        return db.transaction.findMany({
            where: {authorId: parent.id}
        });
    },
    inventories: (parent, args, ctx: Context) => {
        return db.inventory.findMany({
            where: {
                authorId: parent.id
            }
        })
    }
}