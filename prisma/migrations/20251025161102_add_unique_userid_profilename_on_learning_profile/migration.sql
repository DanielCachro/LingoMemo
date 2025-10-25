/*
  Warnings:

  - A unique constraint covering the columns `[userId,profileName]` on the table `LearningProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LearningProfile_userId_profileName_key" ON "public"."LearningProfile"("userId", "profileName");
