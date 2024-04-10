-- CreateTable
CREATE TABLE "Users" (
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

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserEmailAddresses" (
    "id" TEXT NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "verification" TEXT NOT NULL,

    CONSTRAINT "UserEmailAddresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPhoneNumbers" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserPhoneNumbers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_primaryEmailAddress_key" ON "Users"("primaryEmailAddress");

-- AddForeignKey
ALTER TABLE "UserEmailAddresses" ADD CONSTRAINT "UserEmailAddresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPhoneNumbers" ADD CONSTRAINT "UserPhoneNumbers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
