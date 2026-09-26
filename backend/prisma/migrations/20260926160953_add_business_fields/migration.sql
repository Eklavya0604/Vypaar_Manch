/*
  Warnings:

  - Added the required column `city` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Business` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "coverImageUrl" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "state" TEXT NOT NULL;
