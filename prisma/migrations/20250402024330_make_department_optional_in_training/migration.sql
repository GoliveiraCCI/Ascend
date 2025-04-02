-- DropForeignKey
ALTER TABLE `training` DROP FOREIGN KEY `Training_departmentId_fkey`;

-- DropIndex
DROP INDEX `Training_departmentId_fkey` ON `training`;

-- AlterTable
ALTER TABLE `training` MODIFY `departmentId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Training` ADD CONSTRAINT `Training_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
