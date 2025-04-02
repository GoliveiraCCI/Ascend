/*
  Warnings:

  - You are about to drop the column `cid` on the `medicalleave` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `MedicalLeave` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `employee` ADD COLUMN `onMedicalLeave` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `medicalleave` DROP COLUMN `cid`,
    ADD COLUMN `categoryId` VARCHAR(191) NOT NULL,
    MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'AFASTADO',
    MODIFY `notes` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `MedicalLeaveCategory` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MedicalLeave` ADD CONSTRAINT `MedicalLeave_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `MedicalLeaveCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
