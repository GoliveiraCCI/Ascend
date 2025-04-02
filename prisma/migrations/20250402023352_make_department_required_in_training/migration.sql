/*
  Warnings:

  - Made the column `departmentId` on table `training` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `training` DROP FOREIGN KEY `Training_departmentId_fkey`;

-- DropIndex
DROP INDEX `Training_departmentId_fkey` ON `training`;

-- AlterTable
ALTER TABLE `training` MODIFY `departmentId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Training` ADD CONSTRAINT `Training_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
