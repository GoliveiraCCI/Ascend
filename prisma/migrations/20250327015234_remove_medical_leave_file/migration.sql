/*
  Warnings:

  - You are about to drop the `medicalleavefile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `medicalleavefile` DROP FOREIGN KEY `MedicalLeaveFile_medicalLeaveId_fkey`;

-- DropTable
DROP TABLE `medicalleavefile`;
