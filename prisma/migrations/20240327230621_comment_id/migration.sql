/*
  Warnings:

  - You are about to drop the column `postId` on the `Lead` table. All the data in the column will be lost.
  - Added the required column `commentId` to the `Lead` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Lead_postId_idx";

-- AlterTable
ALTER TABLE "Lead" DROP COLUMN "postId",
ADD COLUMN     "commentId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Lead_commentId_idx" ON "Lead"("commentId");
