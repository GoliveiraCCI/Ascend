-- DropForeignKey
ALTER TABLE `medicalleave` DROP FOREIGN KEY `MedicalLeave_categoryId_fkey`;

-- DropIndex
DROP INDEX `MedicalLeave_categoryId_fkey` ON `medicalleave`;

-- AlterTable
ALTER TABLE `medicalleave` MODIFY `notes` VARCHAR(191) NULL,
    MODIFY `categoryId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `MedicalLeaveFile` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `medicalLeaveId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MedicalLeave` ADD CONSTRAINT `MedicalLeave_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `MedicalLeaveCategory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MedicalLeaveFile` ADD CONSTRAINT `MedicalLeaveFile_medicalLeaveId_fkey` FOREIGN KEY (`medicalLeaveId`) REFERENCES `MedicalLeave`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
