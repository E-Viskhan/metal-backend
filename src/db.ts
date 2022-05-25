import {PrismaClient} from "@prisma/client";

export let db: PrismaClient;

export function initDB() {
    db = new PrismaClient();
}
