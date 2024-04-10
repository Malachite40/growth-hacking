/*
  Warnings:

  - Added the required column `watchedSubredditId` to the `PotentialThreadReddit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PotentialThreadReddit" ADD COLUMN     "watchedSubredditId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "PotentialThreadReddit" ADD CONSTRAINT "PotentialThreadReddit_watchedSubredditId_fkey" FOREIGN KEY ("watchedSubredditId") REFERENCES "WatchedSubreddit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
