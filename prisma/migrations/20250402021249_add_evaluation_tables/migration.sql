/*
  Warnings:

  - You are about to drop the column `deadline` on the `evaluation` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `evaluation` table. All the data in the column will be lost.
  - You are about to drop the column `template` on the `evaluation` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `evaluation` table. All the data in the column will be lost.
  - You are about to drop the column `categories` on the `evaluationtemplate` table. All the data in the column will be lost.
  - You are about to drop the column `questions` on the `evaluationtemplate` table. All the data in the column will be lost.
  - You are about to drop the column `department` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `lastLogin` on the `user` table. All the data in the column will be lost.
  - Added the required column `date` to the `Evaluation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `evaluatorId` to the `Evaluation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `templateId` to the `Evaluation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `evaluation` DROP COLUMN `deadline`,
    DROP COLUMN `notes`,
    DROP COLUMN `template`,
    DROP COLUMN `type`,
    ADD COLUMN `date` DATETIME(3) NOT NULL,
    ADD COLUMN `evaluatorId` VARCHAR(191) NOT NULL,
    ADD COLUMN `managerEvaluation` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `managerEvaluationStatus` VARCHAR(191) NULL,
    ADD COLUMN `managerGoals` TEXT NULL,
    ADD COLUMN `managerImprovements` TEXT NULL,
    ADD COLUMN `managerStrengths` TEXT NULL,
    ADD COLUMN `score` DOUBLE NULL,
    ADD COLUMN `selfEvaluation` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `selfEvaluationStatus` VARCHAR(191) NULL,
    ADD COLUMN `selfGoals` TEXT NULL,
    ADD COLUMN `selfImprovements` TEXT NULL,
    ADD COLUMN `selfStrengths` TEXT NULL,
    ADD COLUMN `templateId` VARCHAR(191) NOT NULL,
    MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'Pendente';

-- AlterTable
ALTER TABLE `evaluationtemplate` DROP COLUMN `categories`,
    DROP COLUMN `questions`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `department`,
    DROP COLUMN `isActive`,
    DROP COLUMN `lastLogin`,
    ADD COLUMN `emailVerified` DATETIME(3) NULL,
    ADD COLUMN `image` VARCHAR(191) NULL,
    MODIFY `name` VARCHAR(191) NULL,
    MODIFY `email` VARCHAR(191) NULL,
    MODIFY `password` VARCHAR(191) NULL,
    MODIFY `role` VARCHAR(191) NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE `EvaluationCategory` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EvaluationQuestion` (
    `id` VARCHAR(191) NOT NULL,
    `categoryId` VARCHAR(191) NOT NULL,
    `text` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `EvaluationQuestion_categoryId_idx`(`categoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EvaluationAnswer` (
    `id` VARCHAR(191) NOT NULL,
    `evaluationId` VARCHAR(191) NOT NULL,
    `questionId` VARCHAR(191) NOT NULL,
    `selfScore` DOUBLE NULL,
    `managerScore` DOUBLE NULL,
    `selfComment` TEXT NULL,
    `managerComment` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `EvaluationAnswer_evaluationId_idx`(`evaluationId`),
    INDEX `EvaluationAnswer_questionId_idx`(`questionId`),
    UNIQUE INDEX `EvaluationAnswer_evaluationId_questionId_key`(`evaluationId`, `questionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Employee_active_idx` ON `Employee`(`active`);

-- CreateIndex
CREATE INDEX `Employee_terminationDate_idx` ON `Employee`(`terminationDate`);

-- CreateIndex
CREATE INDEX `Evaluation_evaluatorId_idx` ON `Evaluation`(`evaluatorId`);

-- CreateIndex
CREATE INDEX `Evaluation_templateId_idx` ON `Evaluation`(`templateId`);

-- CreateIndex
CREATE INDEX `Evaluation_status_idx` ON `Evaluation`(`status`);

-- AddForeignKey
ALTER TABLE `Evaluation` ADD CONSTRAINT `Evaluation_evaluatorId_fkey` FOREIGN KEY (`evaluatorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evaluation` ADD CONSTRAINT `Evaluation_templateId_fkey` FOREIGN KEY (`templateId`) REFERENCES `EvaluationTemplate`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EvaluationQuestion` ADD CONSTRAINT `EvaluationQuestion_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `EvaluationCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EvaluationAnswer` ADD CONSTRAINT `EvaluationAnswer_evaluationId_fkey` FOREIGN KEY (`evaluationId`) REFERENCES `Evaluation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EvaluationAnswer` ADD CONSTRAINT `EvaluationAnswer_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `EvaluationQuestion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `employee` RENAME INDEX `Employee_departmentId_fkey` TO `Employee_departmentId_idx`;

-- RenameIndex
ALTER TABLE `employee` RENAME INDEX `Employee_positionId_fkey` TO `Employee_positionId_idx`;

-- RenameIndex
ALTER TABLE `employee` RENAME INDEX `Employee_positionLevelId_fkey` TO `Employee_positionLevelId_idx`;

-- RenameIndex
ALTER TABLE `employee` RENAME INDEX `Employee_shiftId_fkey` TO `Employee_shiftId_idx`;

-- RenameIndex
ALTER TABLE `evaluation` RENAME INDEX `Evaluation_employeeId_fkey` TO `Evaluation_employeeId_idx`;
