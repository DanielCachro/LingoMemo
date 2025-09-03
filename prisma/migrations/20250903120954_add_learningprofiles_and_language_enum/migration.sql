-- CreateEnum
CREATE TYPE "public"."SourceLanguages" AS ENUM ('en');

-- CreateEnum
CREATE TYPE "public"."TargetLanguages" AS ENUM ('ca', 'zh', 'cs', 'nl', 'en', 'eo', 'fi', 'fr', 'gl', 'de', 'el', 'hu', 'it', 'ja', 'la', 'lv', 'mk', 'cmn', 'nb', 'nn', 'ang', 'pl', 'pt', 'ro', 'ru', 'sh', 'es', 'sv', 'mul');

-- CreateTable
CREATE TABLE "public"."LearningProfile" (
    "id" SERIAL NOT NULL,
    "sourceLang" "public"."SourceLanguages" NOT NULL,
    "targetLang" "public"."TargetLanguages" NOT NULL,

    CONSTRAINT "LearningProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_LearningProfileToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_LearningProfileToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "LearningProfile_sourceLang_targetLang_key" ON "public"."LearningProfile"("sourceLang", "targetLang");

-- CreateIndex
CREATE INDEX "_LearningProfileToUser_B_index" ON "public"."_LearningProfileToUser"("B");

-- AddForeignKey
ALTER TABLE "public"."_LearningProfileToUser" ADD CONSTRAINT "_LearningProfileToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."LearningProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_LearningProfileToUser" ADD CONSTRAINT "_LearningProfileToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
