-- DropIndex
DROP INDEX `Fixture_tournamentId_homeScore_awayScore_idx` ON `Fixture`;

-- CreateIndex
CREATE INDEX `Fixture_round_tournamentId_homeScore_awayScore_idx` ON `Fixture`(`round`, `tournamentId`, `homeScore`, `awayScore`);
