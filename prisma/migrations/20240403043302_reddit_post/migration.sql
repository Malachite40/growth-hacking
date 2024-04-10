/*
  Warnings:

  - You are about to drop the column `body` on the `RedditPost` table. All the data in the column will be lost.
  - Added the required column `title` to the `RedditPost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RedditPost" DROP COLUMN "body",
ADD COLUMN     "title" TEXT NOT NULL;
