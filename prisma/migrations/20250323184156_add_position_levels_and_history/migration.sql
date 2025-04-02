/*
  Warnings:

  - You are about to drop the column `description` on the `department` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Department_name_key` ON `department`;

-- AlterTable
ALTER TABLE `department` DROP COLUMN `description`;

-- AlterTable
ALTER TABLE `position` MODIFY `description` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `PositionLevel` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `salary` DOUBLE NOT NULL,
    `positionId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EmployeeHistory` (
    `id` VARCHAR(191) NOT NULL,
    `employeeId` VARCHAR(191) NOT NULL,
    `positionLevelId` VARCHAR(191) NULL,
    `departmentId` VARCHAR(191) NULL,
    `shiftId` VARCHAR(191) NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PositionLevel` ADD CONSTRAINT `PositionLevel_positionId_fkey` FOREIGN KEY (`positionId`) REFERENCES `Position`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmployeeHistory` ADD CONSTRAINT `EmployeeHistory_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmployeeHistory` ADD CONSTRAINT `EmployeeHistory_positionLevelId_fkey` FOREIGN KEY (`positionLevelId`) REFERENCES `PositionLevel`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmployeeHistory` ADD CONSTRAINT `EmployeeHistory_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmployeeHistory` ADD CONSTRAINT `EmployeeHistory_shiftId_fkey` FOREIGN KEY (`shiftId`) REFERENCES `Shift`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
