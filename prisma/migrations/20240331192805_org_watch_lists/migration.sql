-- AlterTable
ALTER TABLE "WatchedSubreddit" ADD COLUMN     "organizationWatchedSubredditId" TEXT;

-- CreateTable
CREATE TABLE "OrganizationWatchedSubreddit" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrganizationWatchedSubreddit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OrganizationWatchedSubreddit_organizationId_idx" ON "OrganizationWatchedSubreddit"("organizationId");

-- AddForeignKey
ALTER TABLE "WatchedSubreddit" ADD CONSTRAINT "WatchedSubreddit_organizationWatchedSubredditId_fkey" FOREIGN KEY ("organizationWatchedSubredditId") REFERENCES "OrganizationWatchedSubreddit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationWatchedSubreddit" ADD CONSTRAINT "OrganizationWatchedSubreddit_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
