-- DropForeignKey
ALTER TABLE "public"."AnswerLicense" DROP CONSTRAINT "AnswerLicense_answerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Flashcard" DROP CONSTRAINT "Flashcard_answerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Flashcard" DROP CONSTRAINT "Flashcard_learningProfileId_fkey";

-- DropForeignKey
ALTER TABLE "public"."FlashcardReviewLog" DROP CONSTRAINT "FlashcardReviewLog_flashcardId_fkey";

-- DropForeignKey
ALTER TABLE "public"."FlashcardReviewLog" DROP CONSTRAINT "FlashcardReviewLog_learningProfileId_fkey";

-- DropForeignKey
ALTER TABLE "public"."LearningProfile" DROP CONSTRAINT "LearningProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Preferences" DROP CONSTRAINT "Preferences_userId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Preferences" ADD CONSTRAINT "Preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LearningProfile" ADD CONSTRAINT "LearningProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnswerLicense" ADD CONSTRAINT "AnswerLicense_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "public"."Answer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Flashcard" ADD CONSTRAINT "Flashcard_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "public"."Answer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Flashcard" ADD CONSTRAINT "Flashcard_learningProfileId_fkey" FOREIGN KEY ("learningProfileId") REFERENCES "public"."LearningProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FlashcardReviewLog" ADD CONSTRAINT "FlashcardReviewLog_flashcardId_fkey" FOREIGN KEY ("flashcardId") REFERENCES "public"."Flashcard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FlashcardReviewLog" ADD CONSTRAINT "FlashcardReviewLog_learningProfileId_fkey" FOREIGN KEY ("learningProfileId") REFERENCES "public"."LearningProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
