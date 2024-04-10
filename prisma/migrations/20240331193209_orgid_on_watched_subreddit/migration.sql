/*
  Warnings:

  - You are about to drop the column `organizationWatchedSubredditId` on the `WatchedSubreddit` table. All the data in the column will be lost.
  - You are about to drop the `OrganizationWatchedSubreddit` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `organizationId` to the `WatchedSubreddit` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OrganizationWatchedSubreddit" DROP CONSTRAINT "OrganizationWatchedSubreddit_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "WatchedSubreddit" DROP CONSTRAINT "WatchedSubreddit_organizationWatchedSubredditId_fkey";

-- AlterTable
ALTER TABLE "WatchedSubreddit" DROP COLUMN "organizationWatchedSubredditId",
ADD COLUMN     "organizationId" TEXT NOT NULL;

-- DropTable
DROP TABLE "OrganizationWatchedSubreddit";

-- AddForeignKey
ALTER TABLE "WatchedSubreddit" ADD CONSTRAINT "WatchedSubreddit_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
