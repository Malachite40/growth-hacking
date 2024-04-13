-- AlterTable
ALTER TABLE "WatchedSubreddit" ALTER COLUMN "lastScanAt" DROP NOT NULL,
ALTER COLUMN "lastScanAt" DROP DEFAULT;
