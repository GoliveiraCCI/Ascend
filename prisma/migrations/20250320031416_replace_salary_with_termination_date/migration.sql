/*
  Warnings:

  - You are about to drop the column `salary` on the `employee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `employee` DROP COLUMN `salary`,
    ADD COLUMN `terminationDate` DATETIME(3) NULL;
