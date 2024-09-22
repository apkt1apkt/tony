-- CreateTable
CREATE TABLE `Tournament` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `status` ENUM('Completed', 'OnGoing', 'Created', 'Abandoned') NOT NULL DEFAULT 'Created',
    `numOfPlayers` INTEGER NOT NULL,
    `winnerId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `startedAt` DATETIME(3) NULL,
    `completedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Tournament_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PlayerTournaments` (
    `playerId` INTEGER NOT NULL,
    `tournamentId` INTEGER NOT NULL,

    PRIMARY KEY (`playerId`, `tournamentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PlayerTournaments` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PlayerTournaments_AB_unique`(`A`, `B`),
    INDEX `_PlayerTournaments_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Tournament` ADD CONSTRAINT `Tournament_winnerId_fkey` FOREIGN KEY (`winnerId`) REFERENCES `Player`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlayerTournaments` ADD CONSTRAINT `PlayerTournaments_playerId_fkey` FOREIGN KEY (`playerId`) REFERENCES `Player`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlayerTournaments` ADD CONSTRAINT `PlayerTournaments_tournamentId_fkey` FOREIGN KEY (`tournamentId`) REFERENCES `Tournament`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PlayerTournaments` ADD CONSTRAINT `_PlayerTournaments_A_fkey` FOREIGN KEY (`A`) REFERENCES `Player`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PlayerTournaments` ADD CONSTRAINT `_PlayerTournaments_B_fkey` FOREIGN KEY (`B`) REFERENCES `Tournament`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
