/*
  Warnings:

  - You are about to drop the `UserEmailAddresses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserPhoneNumbers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userSettingsId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserEmailAddresses" DROP CONSTRAINT "UserEmailAddresses_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserPhoneNumbers" DROP CONSTRAINT "UserPhoneNumbers_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "selectedOrganizationId" TEXT,
ADD COLUMN     "userSettingsId" TEXT NOT NULL;

-- DropTable
DROP TABLE "UserEmailAddresses";

-- DropTable
DROP TABLE "UserPhoneNumbers";

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "selectedOrganizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserEmailAddress" (
    "id" TEXT NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "verification" TEXT NOT NULL,

    CONSTRAINT "UserEmailAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPhoneNumber" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserPhoneNumber_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userSettingsId_fkey" FOREIGN KEY ("userSettingsId") REFERENCES "UserSettings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_selectedOrganizationId_fkey" FOREIGN KEY ("selectedOrganizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEmailAddress" ADD CONSTRAINT "UserEmailAddress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPhoneNumber" ADD CONSTRAINT "UserPhoneNumber_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
