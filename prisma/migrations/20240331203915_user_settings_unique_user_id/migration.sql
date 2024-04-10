/*
  Warnings:

  - Made the column `id` on table `UserSettings` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_id_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userSettingsId" TEXT;

-- AlterTable
ALTER TABLE "UserSettings" ALTER COLUMN "id" SET NOT NULL,
ADD CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userSettingsId_fkey" FOREIGN KEY ("userSettingsId") REFERENCES "UserSettings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
