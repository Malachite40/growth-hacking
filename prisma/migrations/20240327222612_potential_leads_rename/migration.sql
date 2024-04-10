/*
  Warnings:

  - You are about to drop the `Lead` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Lead";

-- CreateTable
CREATE TABLE "PotentialLead" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PotentialLead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PotentialLead_postId_idx" ON "PotentialLead"("postId");
