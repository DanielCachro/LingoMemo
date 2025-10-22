gi/*
  Warnings:

  - Added the required column `timeZone` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `utcOffsetMinutes` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "timeZone" TEXT NOT NULL,
ADD COLUMN     "utcOffsetMinutes" INTEGER NOT NULL;
