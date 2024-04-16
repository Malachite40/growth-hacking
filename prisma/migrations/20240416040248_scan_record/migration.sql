/*
  Warnings:

  - You are about to drop the `ScanRecord` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CommentLeadReddit" DROP CONSTRAINT "CommentLeadReddit_scanRecordId_fkey";

-- DropForeignKey
ALTER TABLE "ScanRecord" DROP CONSTRAINT "ScanRecord_watchedSubredditId_fkey";

-- DropTable
DROP TABLE "ScanRecord";

-- CreateTable
CREATE TABLE "SubredditScanRecord" (
    "id" TEXT NOT NULL,
    "watchedSubredditId" TEXT NOT NULL,
    "totalPostsToScan" INTEGER NOT NULL,
    "totalPostsScanned" INTEGER NOT NULL,
    "scanStatus" "ScanStatus" NOT NULL,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubredditScanRecord_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CommentLeadReddit" ADD CONSTRAINT "CommentLeadReddit_scanRecordId_fkey" FOREIGN KEY ("scanRecordId") REFERENCES "SubredditScanRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubredditScanRecord" ADD CONSTRAINT "SubredditScanRecord_watchedSubredditId_fkey" FOREIGN KEY ("watchedSubredditId") REFERENCES "WatchedSubreddit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
