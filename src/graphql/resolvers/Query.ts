import authMiddleware from "../../authMiddleware";
import {Context} from '../../types';
import {db} from "../../db";

export const Query = {
    users: authMiddleware((parent, args, ctx: Context) => {
        return db.user.findMany();
    }),
    transactions: authMiddleware((parent, args, ctx: Context) => {
        return db.transaction.findMany();
    }),
    inventories: authMiddleware((parent, args, ctx: Context) => {
        return db.inventory.findMany();
    }),
    articles: authMiddleware((parent, args, ctx: Context) => {
        return db.article.findMany();
    })
};