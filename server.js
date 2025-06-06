const express = require('express');
const OddsFetcher = require('./services/odds-fetcher');
const config = require('./config');

const app = express();
const port = process.env.PORT || 3000;
const oddsFetcher = new OddsFetcher();

app.get('/odds/:sport', async (req, res) => {
  try {
    const data = await oddsFetcher.fetchSportsData(
      req.params.sport,
      req.query.region || config.REGIONS[0],
      req.query.market || config.MARKETS[0]
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Odds service running on port ${port}`);
});
