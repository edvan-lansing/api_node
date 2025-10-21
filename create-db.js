import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS || process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT || '3306', 10),
    });

    const dbName = process.env.DB_NAME || 'dbmysql';
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;`);
    console.log('Database criada ou já existente:', dbName);
    await conn.end();
    process.exit(0);
  } catch (err) {
    console.error('Erro ao criar database:', err.message || err);
    process.exit(1);
  }
})();