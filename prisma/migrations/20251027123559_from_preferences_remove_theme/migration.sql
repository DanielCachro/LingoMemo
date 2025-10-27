/*
  Warnings:

  - You are about to drop the column `theme` on the `Preferences` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Preferences" DROP COLUMN "theme";

-- DropEnum
DROP TYPE "public"."Theme";
