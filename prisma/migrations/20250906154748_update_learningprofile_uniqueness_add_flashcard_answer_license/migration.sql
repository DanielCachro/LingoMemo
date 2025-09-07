/*
  Warnings:

  - You are about to drop the `_LearningProfileToUser` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,sourceLang,targetLang]` on the table `LearningProfile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[activeLearningProfileId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `LearningProfile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."_LearningProfileToUser" DROP CONSTRAINT "_LearningProfileToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_LearningProfileToUser" DROP CONSTRAINT "_LearningProfileToUser_B_fkey";

-- DropIndex
DROP INDEX "public"."LearningProfile_sourceLang_targetLang_key";

-- AlterTable
ALTER TABLE "public"."LearningProfile" ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."_LearningProfileToUser";

-- CreateTable
CREATE TABLE "public"."AnswerLicense" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "licenseUrl" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "answerId" INTEGER NOT NULL,

    CONSTRAINT "AnswerLicense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Answer" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "phonetic" TEXT,
    "audio" TEXT[],
    "isPersonal" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Flashcard" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "note" TEXT,
    "examples" TEXT[],
    "synonyms" TEXT[],
    "eFactor" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "interval" INTEGER NOT NULL DEFAULT 0,
    "nextReview" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "repetitions" INTEGER NOT NULL DEFAULT 0,
    "answerId" INTEGER NOT NULL,
    "learningProfileId" INTEGER NOT NULL,

    CONSTRAINT "Flashcard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AnswerLicense_answerId_key" ON "public"."AnswerLicense"("answerId");

-- CreateIndex
CREATE UNIQUE INDEX "LearningProfile_userId_sourceLang_targetLang_key" ON "public"."LearningProfile"("userId", "sourceLang", "targetLang");

-- CreateIndex
CREATE UNIQUE INDEX "User_activeLearningProfileId_key" ON "public"."User"("activeLearningProfileId");

-- AddForeignKey
ALTER TABLE "public"."LearningProfile" ADD CONSTRAINT "LearningProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnswerLicense" ADD CONSTRAINT "AnswerLicense_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "public"."Answer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Flashcard" ADD CONSTRAINT "Flashcard_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "public"."Answer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Flashcard" ADD CONSTRAINT "Flashcard_learningProfileId_fkey" FOREIGN KEY ("learningProfileId") REFERENCES "public"."LearningProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
