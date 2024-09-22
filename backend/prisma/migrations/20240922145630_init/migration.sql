-- CreateIndex
CREATE INDEX `Fixture_round_idx` ON `Fixture`(`round`);

-- CreateIndex
CREATE INDEX `Player_is_active_idx` ON `Player`(`is_active`);

-- CreateIndex
CREATE INDEX `PlayerTournaments_playerId_idx` ON `PlayerTournaments`(`playerId`);

-- CreateIndex
CREATE INDEX `Tournament_status_idx` ON `Tournament`(`status`);

-- CreateIndex
CREATE INDEX `Tournament_type_idx` ON `Tournament`(`type`);

-- RenameIndex
ALTER TABLE `Fixture` RENAME INDEX `Fixture_awayId_fkey` TO `Fixture_awayId_idx`;

-- RenameIndex
ALTER TABLE `Fixture` RENAME INDEX `Fixture_homeId_fkey` TO `Fixture_homeId_idx`;

-- RenameIndex
ALTER TABLE `Fixture` RENAME INDEX `Fixture_tournamentId_fkey` TO `Fixture_tournamentId_idx`;

-- RenameIndex
ALTER TABLE `PlayerTournaments` RENAME INDEX `PlayerTournaments_tournamentId_fkey` TO `PlayerTournaments_tournamentId_idx`;
