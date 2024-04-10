/*
  Warnings:

  - You are about to drop the column `threadId` on the `CommentLeadReddit` table. All the data in the column will be lost.
  - You are about to drop the `PotentialThreadReddit` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CommentLeadReddit" DROP CONSTRAINT "CommentLeadReddit_threadId_fkey";

-- DropForeignKey
ALTER TABLE "PotentialThreadReddit" DROP CONSTRAINT "PotentialThreadReddit_watchedSubredditId_fkey";

-- AlterTable
ALTER TABLE "CommentLeadReddit" DROP COLUMN "threadId";

-- DropTable
DROP TABLE "PotentialThreadReddit";
