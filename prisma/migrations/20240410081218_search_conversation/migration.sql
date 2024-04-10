/*
  Warnings:

  - You are about to drop the column `productListId` on the `WatchedSubreddit` table. All the data in the column will be lost.
  - You are about to drop the `ProductList` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `searchConversationId` to the `WatchedSubreddit` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "WatchedSubreddit" DROP CONSTRAINT "WatchedSubreddit_productListId_fkey";

-- AlterTable
ALTER TABLE "WatchedSubreddit" DROP COLUMN "productListId",
ADD COLUMN     "searchConversationId" TEXT NOT NULL;

-- DropTable
DROP TABLE "ProductList";

-- CreateTable
CREATE TABLE "SearchConversation" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SearchConversation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WatchedSubreddit" ADD CONSTRAINT "WatchedSubreddit_searchConversationId_fkey" FOREIGN KEY ("searchConversationId") REFERENCES "SearchConversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
