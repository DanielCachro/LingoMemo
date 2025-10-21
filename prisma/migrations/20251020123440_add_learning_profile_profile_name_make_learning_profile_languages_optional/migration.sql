-- AlterTable
ALTER TABLE "public"."LearningProfile" ADD COLUMN     "profileName" TEXT,
ALTER COLUMN "sourceLang" DROP NOT NULL,
ALTER COLUMN "targetLang" DROP NOT NULL;
