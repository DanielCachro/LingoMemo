/*
  Warnings:

  - You are about to drop the column `streakLastUpdated` on the `LearningProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."LearningProfile" DROP COLUMN "streakLastUpdated";

-- CreateTable
CREATE TABLE "public"."StudyCompletionLog" (
    "id" SERIAL NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "learningProfileId" INTEGER NOT NULL,

    CONSTRAINT "StudyCompletionLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudyCompletionLog_learningProfileId_completedAt_key" ON "public"."StudyCompletionLog"("learningProfileId", "completedAt");

-- AddForeignKey
ALTER TABLE "public"."StudyCompletionLog" ADD CONSTRAINT "StudyCompletionLog_learningProfileId_fkey" FOREIGN KEY ("learningProfileId") REFERENCES "public"."LearningProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
