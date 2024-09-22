-- DropForeignKey
ALTER TABLE `Fixture` DROP FOREIGN KEY `Fixture_awayId_fkey`;

-- DropForeignKey
ALTER TABLE `Fixture` DROP FOREIGN KEY `Fixture_homeId_fkey`;

-- AlterTable
ALTER TABLE `Fixture` MODIFY `homeId` INTEGER NULL,
    MODIFY `awayId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Tournament` ADD COLUMN `numOfLegs` INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE `Fixture` ADD CONSTRAINT `Fixture_homeId_fkey` FOREIGN KEY (`homeId`) REFERENCES `Player`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Fixture` ADD CONSTRAINT `Fixture_awayId_fkey` FOREIGN KEY (`awayId`) REFERENCES `Player`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
