/*
  Warnings:

  - The values [Purchase,Sale] on the enum `OperationType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OperationType_new" AS ENUM ('PURCHASE', 'SALE');
ALTER TABLE "Transaction" ALTER COLUMN "operationType" TYPE "OperationType_new" USING ("operationType"::text::"OperationType_new");
ALTER TYPE "OperationType" RENAME TO "OperationType_old";
ALTER TYPE "OperationType_new" RENAME TO "OperationType";
DROP TYPE "OperationType_old";
COMMIT;
