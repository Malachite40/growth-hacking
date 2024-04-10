/*
  Warnings:

  - You are about to drop the column `userSettingsId` on the `User` table. All the data in the column will be lost.
  - The primary key for the `UserSettings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `UserSettings` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `UserSettings` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_userSettingsId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "userSettingsId",
ADD COLUMN     "userSettingsUserId" TEXT;

-- AlterTable
ALTER TABLE "UserSettings" DROP CONSTRAINT "UserSettings_pkey",
DROP COLUMN "id";

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_userId_key" ON "UserSettings"("userId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userSettingsUserId_fkey" FOREIGN KEY ("userSettingsUserId") REFERENCES "UserSettings"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
