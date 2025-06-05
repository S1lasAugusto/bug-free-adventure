/*
  Warnings:

  - Added the required column `updatedAt` to the `Reflection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reflection" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "control" DROP NOT NULL,
ALTER COLUMN "awareness" DROP NOT NULL,
ALTER COLUMN "strengths" DROP NOT NULL,
ALTER COLUMN "planning" DROP NOT NULL;
