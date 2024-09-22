/*
  Warnings:

  - You are about to alter the column `status` on the `Tournament` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `Tournament` MODIFY `status` ENUM('Completed', 'OnGoing') NOT NULL DEFAULT 'OnGoing';

-- CreateTable
CREATE TABLE `Fixture` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `round` INTEGER NOT NULL,
    `homeId` INTEGER NOT NULL,
    `awayId` INTEGER NOT NULL,
    `score` VARCHAR(191) NULL,
    `tournamentId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Fixture` ADD CONSTRAINT `Fixture_homeId_fkey` FOREIGN KEY (`homeId`) REFERENCES `Player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Fixture` ADD CONSTRAINT `Fixture_awayId_fkey` FOREIGN KEY (`awayId`) REFERENCES `Player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Fixture` ADD CONSTRAINT `Fixture_tournamentId_fkey` FOREIGN KEY (`tournamentId`) REFERENCES `Tournament`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
