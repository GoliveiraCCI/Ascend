/*
  Warnings:

  - You are about to drop the column `score` on the `evaluation` table. All the data in the column will be lost.
  - Made the column `managerEvaluationStatus` on table `evaluation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `selfEvaluationStatus` on table `evaluation` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `evaluationquestion` DROP FOREIGN KEY `EvaluationQuestion_categoryId_fkey`;

-- AlterTable
ALTER TABLE `department` ADD COLUMN `userId` VARCHAR(255) NOT NULL DEFAULT 'system';

-- AlterTable
ALTER TABLE `employee` ADD COLUMN `userId` VARCHAR(255) NOT NULL DEFAULT 'system';

-- AlterTable
ALTER TABLE `employeehistory` ADD COLUMN `userId` VARCHAR(255) NOT NULL DEFAULT 'system';

-- AlterTable
ALTER TABLE `evaluation` DROP COLUMN `score`,
    MODIFY `managerEvaluationStatus` VARCHAR(191) NOT NULL DEFAULT 'Pendente',
    MODIFY `managerGoals` VARCHAR(191) NULL,
    MODIFY `managerImprovements` VARCHAR(191) NULL,
    MODIFY `managerStrengths` VARCHAR(191) NULL,
    MODIFY `selfEvaluationStatus` VARCHAR(191) NOT NULL DEFAULT 'Pendente',
    MODIFY `selfGoals` VARCHAR(191) NULL,
    MODIFY `selfImprovements` VARCHAR(191) NULL,
    MODIFY `selfStrengths` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `evaluationanswer` ADD COLUMN `userId` VARCHAR(255) NOT NULL DEFAULT 'system';

-- AlterTable
ALTER TABLE `evaluationcategory` ADD COLUMN `department` VARCHAR(191) NULL,
    ADD COLUMN `position` VARCHAR(191) NULL,
    ADD COLUMN `userId` VARCHAR(255) NOT NULL DEFAULT 'system';

-- AlterTable
ALTER TABLE `evaluationquestion` ADD COLUMN `templateId` VARCHAR(191) NULL,
    ADD COLUMN `userId` VARCHAR(255) NOT NULL DEFAULT 'system';

-- AlterTable
ALTER TABLE `evaluationtemplate` ADD COLUMN `userId` VARCHAR(255) NOT NULL DEFAULT 'system';

-- AlterTable
ALTER TABLE `file` ADD COLUMN `userId` VARCHAR(255) NOT NULL DEFAULT 'system';

-- AlterTable
ALTER TABLE `medicalleave` ADD COLUMN `userId` VARCHAR(255) NOT NULL DEFAULT 'system';

-- AlterTable
ALTER TABLE `medicalleavecategory` ADD COLUMN `userId` VARCHAR(255) NOT NULL DEFAULT 'system';

-- AlterTable
ALTER TABLE `position` ADD COLUMN `userId` VARCHAR(255) NOT NULL DEFAULT 'system';

-- AlterTable
ALTER TABLE `positionlevel` ADD COLUMN `userId` VARCHAR(255) NOT NULL DEFAULT 'system';

-- AlterTable
ALTER TABLE `shift` ADD COLUMN `userId` VARCHAR(255) NOT NULL DEFAULT 'system';

-- AlterTable
ALTER TABLE `training` ADD COLUMN `userId` VARCHAR(255) NOT NULL DEFAULT 'system';

-- AlterTable
ALTER TABLE `trainingevaluation` ADD COLUMN `userId` VARCHAR(255) NOT NULL DEFAULT 'system';

-- AlterTable
ALTER TABLE `trainingmaterial` ADD COLUMN `userId` VARCHAR(255) NOT NULL DEFAULT 'system';

-- AlterTable
ALTER TABLE `trainingparticipant` ADD COLUMN `userId` VARCHAR(255) NOT NULL DEFAULT 'system';

-- AlterTable
ALTER TABLE `trainingphoto` ADD COLUMN `userId` VARCHAR(255) NOT NULL DEFAULT 'system';

-- AlterTable
ALTER TABLE `trainingsession` ADD COLUMN `userId` VARCHAR(255) NOT NULL DEFAULT 'system';

-- AlterTable
ALTER TABLE `user` ADD COLUMN `profileId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `profile` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` VARCHAR(255) NOT NULL DEFAULT 'system',

    INDEX `profile_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profilepermission` (
    `id` VARCHAR(191) NOT NULL,
    `profileId` VARCHAR(191) NOT NULL,
    `permission` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `profilepermission_profileId_fkey`(`profileId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `department_userId_fkey` ON `department`(`userId`);

-- CreateIndex
CREATE INDEX `employee_userId_fkey` ON `employee`(`userId`);

-- CreateIndex
CREATE INDEX `employeehistory_userId_fkey` ON `employeehistory`(`userId`);

-- CreateIndex
CREATE INDEX `evaluationanswer_userId_fkey` ON `evaluationanswer`(`userId`);

-- CreateIndex
CREATE INDEX `evaluationcategory_userId_fkey` ON `evaluationcategory`(`userId`);

-- CreateIndex
CREATE INDEX `evaluationquestion_templateId_idx` ON `evaluationquestion`(`templateId`);

-- CreateIndex
CREATE INDEX `evaluationquestion_userId_fkey` ON `evaluationquestion`(`userId`);

-- CreateIndex
CREATE INDEX `evaluationtemplate_userId_fkey` ON `evaluationtemplate`(`userId`);

-- CreateIndex
CREATE INDEX `file_userId_fkey` ON `file`(`userId`);

-- CreateIndex
CREATE INDEX `medicalleave_userId_fkey` ON `medicalleave`(`userId`);

-- CreateIndex
CREATE INDEX `medicalleavecategory_userId_fkey` ON `medicalleavecategory`(`userId`);

-- CreateIndex
CREATE INDEX `position_userId_fkey` ON `position`(`userId`);

-- CreateIndex
CREATE INDEX `positionlevel_userId_fkey` ON `positionlevel`(`userId`);

-- CreateIndex
CREATE INDEX `shift_userId_fkey` ON `shift`(`userId`);

-- CreateIndex
CREATE INDEX `training_userId_fkey` ON `training`(`userId`);

-- CreateIndex
CREATE INDEX `trainingevaluation_userId_fkey` ON `trainingevaluation`(`userId`);

-- CreateIndex
CREATE INDEX `trainingmaterial_userId_fkey` ON `trainingmaterial`(`userId`);

-- CreateIndex
CREATE INDEX `trainingparticipant_userId_fkey` ON `trainingparticipant`(`userId`);

-- CreateIndex
CREATE INDEX `trainingphoto_userId_fkey` ON `trainingphoto`(`userId`);

-- CreateIndex
CREATE INDEX `trainingsession_userId_fkey` ON `trainingsession`(`userId`);

-- CreateIndex
CREATE INDEX `user_profileId_fkey` ON `user`(`profileId`);

-- AddForeignKey
ALTER TABLE `department` ADD CONSTRAINT `department_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `employee` ADD CONSTRAINT `employee_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `employeehistory` ADD CONSTRAINT `employeehistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `evaluationanswer` ADD CONSTRAINT `evaluationanswer_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `evaluationcategory` ADD CONSTRAINT `evaluationcategory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `evaluationquestion` ADD CONSTRAINT `evaluationquestion_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `evaluationcategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `evaluationquestion` ADD CONSTRAINT `evaluationquestion_templateId_fkey` FOREIGN KEY (`templateId`) REFERENCES `evaluationtemplate`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `evaluationquestion` ADD CONSTRAINT `evaluationquestion_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `evaluationtemplate` ADD CONSTRAINT `evaluationtemplate_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `file` ADD CONSTRAINT `file_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `medicalleave` ADD CONSTRAINT `medicalleave_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `medicalleavecategory` ADD CONSTRAINT `medicalleavecategory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `position` ADD CONSTRAINT `position_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `positionlevel` ADD CONSTRAINT `positionlevel_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `shift` ADD CONSTRAINT `shift_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `training` ADD CONSTRAINT `training_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `trainingevaluation` ADD CONSTRAINT `trainingevaluation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `trainingmaterial` ADD CONSTRAINT `trainingmaterial_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `trainingparticipant` ADD CONSTRAINT `trainingparticipant_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `trainingphoto` ADD CONSTRAINT `trainingphoto_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `trainingsession` ADD CONSTRAINT `trainingsession_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `profile`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profile` ADD CONSTRAINT `profile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `profilepermission` ADD CONSTRAINT `profilepermission_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `profile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `evaluationquestion` RENAME INDEX `EvaluationQuestion_categoryId_idx` TO `evaluationquestion_categoryId_idx`;
