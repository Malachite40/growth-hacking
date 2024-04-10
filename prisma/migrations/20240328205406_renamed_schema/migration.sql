/*
  Warnings:

  - You are about to drop the `Lead` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PotentialLead` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Lead";

-- DropTable
DROP TABLE "PotentialLead";

-- CreateTable
CREATE TABLE "PotentialThreadReddit" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PotentialThreadReddit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentLeadReddit" (
    "id" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommentLeadReddit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PotentialThreadReddit_postId_idx" ON "PotentialThreadReddit"("postId");

-- CreateIndex
CREATE INDEX "CommentLeadReddit_commentId_idx" ON "CommentLeadReddit"("commentId");
