/*
  Warnings:

  - Added the required column `redditPostId` to the `CommentLeadReddit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CommentLeadReddit" ADD COLUMN     "redditPostId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "RedditPost" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RedditPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RedditPost_postId_idx" ON "RedditPost"("postId");

-- AddForeignKey
ALTER TABLE "CommentLeadReddit" ADD CONSTRAINT "CommentLeadReddit_redditPostId_fkey" FOREIGN KEY ("redditPostId") REFERENCES "RedditPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
