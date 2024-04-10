/*
  Warnings:

  - You are about to alter the column `score` on the `CommentLeadReddit` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `score` on the `PotentialThreadReddit` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Added the required column `threadId` to the `CommentLeadReddit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CommentLeadReddit" ADD COLUMN     "threadId" TEXT NOT NULL,
ALTER COLUMN "score" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "PotentialThreadReddit" ALTER COLUMN "score" SET DATA TYPE INTEGER;

-- AddForeignKey
ALTER TABLE "CommentLeadReddit" ADD CONSTRAINT "CommentLeadReddit_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "PotentialThreadReddit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
