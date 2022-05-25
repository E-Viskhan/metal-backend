import {Context} from "../../types";
import {db} from "../../db";

export const Transaction = {
    author: (parent, args, ctx: Context) => {
        return db.user.findUnique({
            where: {
                id: parent.authorId
            }
        })
    },
    article: (parent, args, ctx: Context) => {
        return db.article.findUnique({
            where: {
                id: parent.articleId
            }
        })
    },
    articleName: async (parent, args, ctx: Context) => {
        const article = await db.article.findUnique({
            where: {
                id: parent.articleId
            }
        });

        return article?.name
    }
};