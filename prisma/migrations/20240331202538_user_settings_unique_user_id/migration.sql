/*
  Warnings:

  - You are about to drop the column `userSettingsUserId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_userSettingsUserId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "userSettingsUserId";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_id_fkey" FOREIGN KEY ("id") REFERENCES "UserSettings"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
