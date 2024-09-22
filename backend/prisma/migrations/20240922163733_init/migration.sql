/*
  Warnings:

  - You are about to drop the column `completedAt` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `startedAt` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `winnerId` on the `Tournament` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Tournament` DROP FOREIGN KEY `Tournament_winnerId_fkey`;

-- DropIndex
DROP INDEX `Tournament_status_idx` ON `Tournament`;

-- AlterTable
ALTER TABLE `Tournament` DROP COLUMN `completedAt`,
    DROP COLUMN `startedAt`,
    DROP COLUMN `status`,
    DROP COLUMN `winnerId`;
