/*
  Warnings:

  - Added the required column `postId` to the `Lead` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "postId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Lead_postId_idx" ON "Lead"("postId");
