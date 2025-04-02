/*
  Warnings:

  - A unique constraint covering the columns `[matricula]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `matricula` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `employee` ADD COLUMN `matricula` VARCHAR(191) NOT NULL,
    ADD COLUMN `shiftId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Employee_matricula_key` ON `Employee`(`matricula`);

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_shiftId_fkey` FOREIGN KEY (`shiftId`) REFERENCES `Shift`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
