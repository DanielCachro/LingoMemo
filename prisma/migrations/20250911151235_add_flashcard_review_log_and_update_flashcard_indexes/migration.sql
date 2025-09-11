/*
  Warnings:

  - You are about to drop the column `repetitions` on the `Flashcard` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Flashcard" DROP COLUMN "repetitions";

-- CreateTable
CREATE TABLE "public"."FlashcardReviewLog" (
    "id" SERIAL NOT NULL,
    "flashcardId" INTEGER NOT NULL,
    "learningProfileId" INTEGER NOT NULL,
    "reviewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eFactor" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "FlashcardReviewLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FlashcardReviewLog_flashcardId_reviewedAt_idx" ON "public"."FlashcardReviewLog"("flashcardId", "reviewedAt");

-- CreateIndex
CREATE INDEX "FlashcardReviewLog_learningProfileId_reviewedAt_idx" ON "public"."FlashcardReviewLog"("learningProfileId", "reviewedAt");

-- CreateIndex
CREATE INDEX "Flashcard_learningProfileId_nextReview_idx" ON "public"."Flashcard"("learningProfileId", "nextReview");

-- AddForeignKey
ALTER TABLE "public"."FlashcardReviewLog" ADD CONSTRAINT "FlashcardReviewLog_flashcardId_fkey" FOREIGN KEY ("flashcardId") REFERENCES "public"."Flashcard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FlashcardReviewLog" ADD CONSTRAINT "FlashcardReviewLog_learningProfileId_fkey" FOREIGN KEY ("learningProfileId") REFERENCES "public"."LearningProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
