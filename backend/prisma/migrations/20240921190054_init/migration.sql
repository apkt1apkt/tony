/*
  Warnings:

  - You are about to drop the column `score` on the `Fixture` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Fixture` DROP COLUMN `score`,
    ADD COLUMN `awayScore` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `homeScore` INTEGER NOT NULL DEFAULT 0;
