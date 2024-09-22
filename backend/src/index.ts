import express from 'express';
import dotenv from 'dotenv';
import 'express-async-errors';
import * as playerService from './services/player.service';
import * as tournamentService from './services/tournament.service';
import * as fixtureService from './services/fixture.service';

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/players', async (req, res) => {
  res.json(await playerService.getPlayers());
});

app.post('/players', async (req, res) => {
  res.json(await playerService.createPlayer(req.body.name));
});

app.post('/players/:id/activate', async (req, res) => {
  res.json(
    await playerService.activatePlayer(
      Number(req.params.id),
      req.body.asActive,
    ),
  );
});

app.get('/tournaments/:id', async (req, res) => {
  res.json(await tournamentService.getTournamentById(Number(req.params.id)));
});

app.post('/tournaments/:id/standing', async (req, res) => {
  res.json(await tournamentService.calculateStandings(Number(req.params.id)));
});

app.get('/tournaments', async (req, res) => {
  res.json(await tournamentService.getTournaments());
});

app.post('/tournaments', async (req, res) => {
  const { name, type, numOfLegs } = req.body;
  res.json(
    await tournamentService.createTournament({
      name,
      type,
      numOfLegs,
    }),
  );
});

app.post('/fixtures/:id/scores', async (req, res) => {
  res.json(
    await fixtureService.saveFixtureScore(Number(req.params.id), req.body),
  );
});

app.use((err: any, req: any, res: any, next: any) => {
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
  next();
});

const port = process.env.PORT || 9000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
