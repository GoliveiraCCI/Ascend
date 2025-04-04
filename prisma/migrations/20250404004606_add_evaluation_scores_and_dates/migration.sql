-- AlterTable
ALTER TABLE `evaluation` ADD COLUMN `finalScore` DOUBLE NULL,
    ADD COLUMN `managerEvaluationDate` DATETIME(3) NULL,
    ADD COLUMN `managerScore` DOUBLE NULL,
    ADD COLUMN `selfEvaluationDate` DATETIME(3) NULL,
    ADD COLUMN `selfScore` DOUBLE NULL,
    MODIFY `managerEvaluationStatus` VARCHAR(191) NULL DEFAULT 'Pendente',
    MODIFY `selfEvaluationStatus` VARCHAR(191) NULL DEFAULT 'Pendente';
