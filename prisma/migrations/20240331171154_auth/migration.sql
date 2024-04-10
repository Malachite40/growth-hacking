/*
  Warnings:

  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserEmailAddresses" DROP CONSTRAINT "UserEmailAddresses_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserPhoneNumbers" DROP CONSTRAINT "UserPhoneNumbers_userId_fkey";

-- DropTable
DROP TABLE "Users";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "username" TEXT,
    "birthday" TEXT,
    "gender" TEXT,
    "profileImageUrl" TEXT,
    "passwordEnabled" BOOLEAN NOT NULL,
    "twoFactorEnabled" BOOLEAN NOT NULL,
    "lastSignInAt" TIMESTAMPTZ NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "primaryEmailAddress" TEXT NOT NULL,
    "primaryEmailAddressId" TEXT,
    "primaryPhoneNumberId" TEXT,
    "primaryWeb3WalletId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_primaryEmailAddress_key" ON "User"("primaryEmailAddress");

-- AddForeignKey
ALTER TABLE "UserEmailAddresses" ADD CONSTRAINT "UserEmailAddresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPhoneNumbers" ADD CONSTRAINT "UserPhoneNumbers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
