import express from 'express';
import cors from 'cors';
import queryHandler from './api/query.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

app.get('/test', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({ status: 'ok' });
});

app.post('/api/query', async (req, res) => {
  const data = await queryHandler(req, res);
  return res.status(200).json(data);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Express server listening on http://localhost:${PORT}`);
});
