-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "activeLearningProfileId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_activeLearningProfileId_fkey" FOREIGN KEY ("activeLearningProfileId") REFERENCES "public"."LearningProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
