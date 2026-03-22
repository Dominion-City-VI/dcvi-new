import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './db.js';
import analyticsRouter from './routes/analytics.js';
import restrictionsRouter, { ensureRestrictionsTable } from './routes/restrictions.js';
import emailRouter, { ensureEmailLogsTable } from './routes/email.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';

const app = express();
// Render sets PORT; fall back to 3001 for local dev
const PORT = process.env.PORT || process.env.API_PORT || 3001;

// In dev the Vite dev server and Express are on different ports — CORS needed.
// In production they are served from the same Express process/origin — not needed.
if (!isProd) {
  app.use(cors({ origin: true }));
}

app.use(express.json({ limit: '10mb' }));

// ── API routes (must come before static file catch-all) ──────────────────────
app.use('/api/local', analyticsRouter);
app.use('/api/local/restrictions', restrictionsRouter);
app.use('/api/local/email', emailRouter);

app.get('/api/local/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Static frontend (production only) ────────────────────────────────────────
// Vite builds to dist/. Express serves it, and the catch-all sends all
// non-API requests to index.html so the React SPA handles its own routing.
if (isProd) {
  const distDir = path.join(__dirname, '../dist');
  app.use(express.static(distDir));
  app.get(/.*/, (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`Server running on port ${PORT} (${isProd ? 'production' : 'development'})`);
  try {
    await pool.query('SELECT 1');
    console.log('DB connection warmed up');
    await ensureRestrictionsTable();
    await ensureEmailLogsTable();
    console.log('DB tables verified');
  } catch (err) {
    console.error('DB warmup failed:', err.message);
  }
});
