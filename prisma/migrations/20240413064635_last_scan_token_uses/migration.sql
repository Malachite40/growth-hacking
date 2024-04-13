/*
  Warnings:

  - Made the column `userTokenBalanceId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_userTokenBalanceId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "userTokenBalanceId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userTokenBalanceId_fkey" FOREIGN KEY ("userTokenBalanceId") REFERENCES "UserTokenBalance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
