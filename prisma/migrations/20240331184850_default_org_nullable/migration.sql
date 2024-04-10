-- DropForeignKey
ALTER TABLE "UserSettings" DROP CONSTRAINT "UserSettings_selectedOrganizationId_fkey";

-- AlterTable
ALTER TABLE "UserSettings" ALTER COLUMN "selectedOrganizationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_selectedOrganizationId_fkey" FOREIGN KEY ("selectedOrganizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
