/*
  Warnings:

  - Added the required column `productListId` to the `WatchedSubreddit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WatchedSubreddit" ADD COLUMN     "productListId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "WatchedSubreddit" ADD CONSTRAINT "WatchedSubreddit_productListId_fkey" FOREIGN KEY ("productListId") REFERENCES "ProductList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
