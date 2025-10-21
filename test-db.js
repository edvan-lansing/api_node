import pool from './db.js';

(async () => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    console.log('DB ok', rows);
    await pool.end();
  } catch (err) {
    console.error('DB connection error:', err.message || err);
    process.exit(1);
  }
})();