-- AlterTable
ALTER TABLE `Tournament` ADD COLUMN `type` ENUM('Knockout', 'League') NOT NULL DEFAULT 'League';
