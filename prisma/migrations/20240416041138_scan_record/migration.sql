/*
  Warnings:

  - Added the required column `potentialLeads` to the `SubredditScanRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SubredditScanRecord" ADD COLUMN     "potentialLeads" INTEGER NOT NULL;
