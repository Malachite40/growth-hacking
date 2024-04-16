-- CreateEnum
CREATE TYPE "ScanStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'ERROR', 'COMPLETED');

-- DropForeignKey
ALTER TABLE "WatchedSubreddit" DROP CONSTRAINT "WatchedSubreddit_searchConversationId_fkey";

-- AlterTable
ALTER TABLE "CommentLeadReddit" ADD COLUMN     "scanRecordId" TEXT;

-- AlterTable
ALTER TABLE "WatchedSubreddit" ALTER COLUMN "searchConversationId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "ScanRecord" (
    "id" TEXT NOT NULL,
    "watchedSubredditId" TEXT NOT NULL,
    "totalPostsToScan" INTEGER NOT NULL,
    "totalPostsScanned" INTEGER NOT NULL,
    "scanStatus" "ScanStatus" NOT NULL,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScanRecord_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CommentLeadReddit" ADD CONSTRAINT "CommentLeadReddit_scanRecordId_fkey" FOREIGN KEY ("scanRecordId") REFERENCES "ScanRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchedSubreddit" ADD CONSTRAINT "WatchedSubreddit_searchConversationId_fkey" FOREIGN KEY ("searchConversationId") REFERENCES "SearchConversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScanRecord" ADD CONSTRAINT "ScanRecord_watchedSubredditId_fkey" FOREIGN KEY ("watchedSubredditId") REFERENCES "WatchedSubreddit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
