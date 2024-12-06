import express from 'express';
import dotenv from 'dotenv';
import 'express-async-errors';
import * as playerService from './services/player.service';
import * as tournamentService from './services/tournament.service';
import * as fixtureService from './services/fixture.service';

dotenv.config();
const app = express();
const router = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

router.get('/players', async (req, res) => {
  res.json(await playerService.getPlayers());
});

router.post('/players', async (req, res) => {
  res.json(await playerService.createPlayer(req.body.name));
});

router.post('/players/:id/activate', async (req, res) => {
  res.json(
    await playerService.activatePlayer(
      Number(req.params.id),
      req.body.asActive,
    ),
  );
});

router.get('/tournaments/:id', async (req, res) => {
  res.json(await tournamentService.getTournamentById(Number(req.params.id)));
});

router.post('/tournaments/:id/standing', async (req, res) => {
  res.json(await tournamentService.calculateStandings(Number(req.params.id)));
});

router.get('/tournaments', async (req, res) => {
  res.json(await tournamentService.getTournaments());
});

router.post('/tournaments', async (req, res) => {
  const { name, type, numOfLegs } = req.body;
  res.json(
    await tournamentService.createTournament({
      name,
      type,
      numOfLegs,
    }),
  );
});

router.post('/fixtures/:id/scores', async (req, res) => {
  res.json(
    await fixtureService.saveFixtureScore(Number(req.params.id), req.body),
  );
});

router.put('/fixtures/:id/scores', async (req, res) => {
  res.json(
    await fixtureService.editFixtureScore(Number(req.params.id), req.body),
  );
});

app.use('/tony', router);

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
