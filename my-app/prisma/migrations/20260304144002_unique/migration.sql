/*
  Warnings:

  - A unique constraint covering the columns `[testCode]` on the table `Test` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Test" ADD COLUMN     "testCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Test_testCode_key" ON "Test"("testCode");
