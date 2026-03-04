-- DropForeignKey
ALTER TABLE "Test" DROP CONSTRAINT "Test_patientId_fkey";

-- AlterTable
ALTER TABLE "Test" ALTER COLUMN "patientId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
