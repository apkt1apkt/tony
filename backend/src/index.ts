import express from 'express';
import dotenv from 'dotenv';
import './fly';

dotenv.config();

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const port = process.env.PORT || 9000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
