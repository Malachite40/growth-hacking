/*
  Warnings:

  - You are about to drop the column `subreddit` on the `WatchedSubreddit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "WatchedSubreddit" DROP COLUMN "subreddit";

-- CreateTable
CREATE TABLE "Subreddit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "watchedSubredditId" TEXT,

    CONSTRAINT "Subreddit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Subreddit" ADD CONSTRAINT "Subreddit_watchedSubredditId_fkey" FOREIGN KEY ("watchedSubredditId") REFERENCES "WatchedSubreddit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
