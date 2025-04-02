-- AlterTable
ALTER TABLE `medicalleave` ADD COLUMN `doctor` VARCHAR(191) NULL,
    ADD COLUMN `hospital` VARCHAR(191) NULL,
    ADD COLUMN `notes` TEXT NULL;
