-- AlterTable
ALTER TABLE `employee` ADD COLUMN `positionLevelId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_positionLevelId_fkey` FOREIGN KEY (`positionLevelId`) REFERENCES `PositionLevel`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
