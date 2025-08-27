/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."Theme" AS ENUM ('Light', 'Dark', 'Automatic');

-- DropTable
DROP TABLE "public"."Post";

-- CreateTable
CREATE TABLE "public"."User" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Preferences" (
    "id" SERIAL NOT NULL,
    "theme" "public"."Theme" NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Preferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Preferences_userId_key" ON "public"."Preferences"("userId");

-- AddForeignKey
ALTER TABLE "public"."Preferences" ADD CONSTRAINT "Preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
