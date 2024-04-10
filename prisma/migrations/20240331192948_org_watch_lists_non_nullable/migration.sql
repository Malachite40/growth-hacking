/*
  Warnings:

  - Made the column `organizationWatchedSubredditId` on table `WatchedSubreddit` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "WatchedSubreddit" DROP CONSTRAINT "WatchedSubreddit_organizationWatchedSubredditId_fkey";

-- AlterTable
ALTER TABLE "WatchedSubreddit" ALTER COLUMN "organizationWatchedSubredditId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "WatchedSubreddit" ADD CONSTRAINT "WatchedSubreddit_organizationWatchedSubredditId_fkey" FOREIGN KEY ("organizationWatchedSubredditId") REFERENCES "OrganizationWatchedSubreddit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
