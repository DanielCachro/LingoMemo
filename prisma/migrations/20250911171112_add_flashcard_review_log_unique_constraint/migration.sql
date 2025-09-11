/*
  Warnings:

  - A unique constraint covering the columns `[flashcardId,learningProfileId,reviewedAt]` on the table `FlashcardReviewLog` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FlashcardReviewLog_flashcardId_learningProfileId_reviewedAt_key" ON "public"."FlashcardReviewLog"("flashcardId", "learningProfileId", "reviewedAt");
