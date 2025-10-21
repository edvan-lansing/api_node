import pool from './db.js';
import dotenv from 'dotenv';
dotenv.config();

(async () => {
  try {
    const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      birthDate DATETIME NOT NULL,
      cpf VARCHAR(50) NOT NULL UNIQUE,
      nickname VARCHAR(255) NOT NULL,
      gender VARCHAR(50) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      telephone VARCHAR(100) NOT NULL,
      state VARCHAR(100) NOT NULL,
      country VARCHAR(100) NOT NULL,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await pool.query(sql);
    console.log('Tabela users criada (ou já existente).');
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('Erro ao criar tabela:', err.message || err);
    process.exit(1);
  }
})();