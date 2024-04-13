/*
  Warnings:

  - You are about to drop the column `selectedOrganizationId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UserTokenBalance` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserTokenBalance" DROP CONSTRAINT "UserTokenBalance_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "selectedOrganizationId",
ADD COLUMN     "userTokenBalanceId" TEXT;

-- AlterTable
ALTER TABLE "UserTokenBalance" DROP COLUMN "userId";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userTokenBalanceId_fkey" FOREIGN KEY ("userTokenBalanceId") REFERENCES "UserTokenBalance"("id") ON DELETE SET NULL ON UPDATE CASCADE;
