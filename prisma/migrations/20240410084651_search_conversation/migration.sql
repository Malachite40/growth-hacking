/*
  Warnings:

  - Added the required column `watchedSubredditId` to the `CommentLeadReddit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CommentLeadReddit" ADD COLUMN     "watchedSubredditId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "CommentLeadReddit" ADD CONSTRAINT "CommentLeadReddit_watchedSubredditId_fkey" FOREIGN KEY ("watchedSubredditId") REFERENCES "WatchedSubreddit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
