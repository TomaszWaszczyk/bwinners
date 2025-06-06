const express = require('express');
const app = express();

const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';

// 1. Display Games & Odds
app.get('/games-odds', async (req, res) => {
  const data = await readSheet(SPREADSHEET_ID, 'Games & Odds!A2:G');
  res.json(data);
});

// 2. Place Bets
app.post('/place-bet', async (req, res) => {
  const { user, gameId, betType, amount, odds } = req.body;
  const timestamp = new Date().toISOString();
  await writeSheet(SPREADSHEET_ID, 'Place Bets!A2', [[user, gameId, betType, amount, odds, timestamp]]);
  res.json({ status: 'Bet placed' });
});

// 3. Display User Results
app.get('/user-results', async (req, res) => {
  const data = await readSheet(SPREADSHEET_ID, 'User Results!A2:H');
  res.json(data);
});

app.listen(3000, () => console.log('Google Sheets UI microservice running'));
