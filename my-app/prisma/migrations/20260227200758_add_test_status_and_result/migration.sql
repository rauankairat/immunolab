/*
  Warnings:

  - Added the required column `updatedAt` to the `Test` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TestStatus" AS ENUM ('UPCOMING', 'CURRENT', 'PAST');

-- AlterTable
ALTER TABLE "Test" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "resultName" TEXT,
ADD COLUMN     "resultUrl" TEXT,
ADD COLUMN     "status" "TestStatus" NOT NULL DEFAULT 'UPCOMING',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "uploadedAt" TIMESTAMP(3);
