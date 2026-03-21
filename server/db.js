import pg from 'pg';

const { Pool } = pg;

if (!process.env.DCVI_DATABASE_URL) {
  console.error('DCVI_DATABASE_URL environment variable is not set');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DCVI_DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
});

pool.on('error', (err) => {
  console.error('Unexpected database error:', err.message);
});

export default pool;
