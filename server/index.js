import express from 'express';
import cors from 'cors';
import pool from './db.js';
import analyticsRouter from './routes/analytics.js';

const app = express();
const PORT = process.env.API_PORT || 3001;

app.use(cors({ origin: ['http://localhost:5000', `http://0.0.0.0:5000`] }));
app.use(express.json());

app.use('/api/local', analyticsRouter);

app.get('/api/local/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`Analytics API running on port ${PORT}`);
  try {
    await pool.query('SELECT 1');
    console.log('DB connection warmed up');
  } catch (err) {
    console.error('DB warmup failed:', err.message);
  }
});
