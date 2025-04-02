/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `file` table. All the data in the column will be lost.
  - Made the column `medicalLeaveId` on table `file` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `file` DROP FOREIGN KEY `File_medicalLeaveId_fkey`;

-- DropIndex
DROP INDEX `File_medicalLeaveId_key` ON `file`;

-- AlterTable
ALTER TABLE `file` DROP COLUMN `updatedAt`,
    MODIFY `medicalLeaveId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_medicalLeaveId_fkey` FOREIGN KEY (`medicalLeaveId`) REFERENCES `MedicalLeave`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
