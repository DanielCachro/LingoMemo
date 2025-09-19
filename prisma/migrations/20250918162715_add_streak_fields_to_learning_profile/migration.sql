-- AlterTable
ALTER TABLE "public"."LearningProfile" ADD COLUMN     "longestStreak" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "streakCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "streakLastUpdated" TIMESTAMP(3);
