import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';
import { parse, isValid, format } from 'date-fns';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const allowedGenders = ["Masculino", "Feminino", "Outros"];

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.get('/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    const formatted = rows.map(u => ({
      ...u,
      birthDate: u.birthDate ? format(new Date(u.birthDate), 'dd-MM-yyyy') : null,
    }));
    res.json(formatted);
  } catch (err) {
    console.error('GET /users error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Usuário não encontrado' });
    const user = rows[0];
    user.birthDate = user.birthDate ? format(new Date(user.birthDate), 'dd-MM-yyyy') : null;
    res.json(user);
  } catch (err) {
    console.error('GET /users/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/users', async (req, res) => {
  try {
    const {
      name,
      birthDate: rawDate,
      cpf,
      nickname,
      gender,
      email,
      telephone,
      state,
      country,
    } = req.body;

    if (!name || !rawDate || !cpf || !nickname || !gender || !email || !telephone || !state || !country) {
      return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
    }

    if (!allowedGenders.includes(gender)) {
      return res.status(400).json({ error: 'Gênero inválido. Escolha Masculino, Feminino ou Outros.' });
    }

    const parsedDate = parse(rawDate, 'dd-MM-yyyy', new Date());
    if (!isValid(parsedDate)) {
      return res.status(400).json({ error: 'Formato de data inválido. Use dd-MM-yyyy.' });
    }
    const birthDateSql = format(parsedDate, 'yyyy-MM-dd HH:mm:ss');

    const sql = `INSERT INTO users
      (name, birthDate, cpf, nickname, gender, email, telephone, state, country, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
    const params = [name, birthDateSql, cpf, nickname, gender, email, telephone, state, country];

    const [result] = await pool.query(sql, params);
    const insertedId = result.insertId;
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [insertedId]);
    const user = rows[0];
    user.birthDate = user.birthDate ? format(new Date(user.birthDate), 'dd-MM-yyyy') : null;
    res.status(201).json(user);
  } catch (err) {
    console.error('POST /users error:', err);
    if (err && err.code === 'ER_DUP_ENTRY') {
      // MySQL duplicate entry error message contains the key name
      return res.status(400).json({ error: 'Valor duplicado (cpf ou email já cadastrado).' });
    }
    res.status(500).json({ error: err.message || 'Failed to create user.' });
  }
});

app.put('/users/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    const {
      name,
      birthDate: rawDate,
      cpf,
      nickname,
      gender,
      email,
      telephone,
      state,
      country,
    } = req.body;

    if (gender && !allowedGenders.includes(gender)) {
      return res.status(400).json({ error: 'Gênero inválido.' });
    }

    let birthDateSql = undefined;
    if (rawDate) {
      const parsedDate = parse(rawDate, 'dd-MM-yyyy', new Date());
      if (!isValid(parsedDate)) return res.status(400).json({ error: 'Formato de data inválido. Use dd-MM-yyyy.' });
      birthDateSql = format(parsedDate, 'yyyy-MM-dd HH:mm:ss');
    }

    // Build dynamic update
    const fields = [];
    const params = [];
    if (name !== undefined) { fields.push('name = ?'); params.push(name); }
    if (birthDateSql !== undefined) { fields.push('birthDate = ?'); params.push(birthDateSql); }
    if (cpf !== undefined) { fields.push('cpf = ?'); params.push(cpf); }
    if (nickname !== undefined) { fields.push('nickname = ?'); params.push(nickname); }
    if (gender !== undefined) { fields.push('gender = ?'); params.push(gender); }
    if (email !== undefined) { fields.push('email = ?'); params.push(email); }
    if (telephone !== undefined) { fields.push('telephone = ?'); params.push(telephone); }
    if (state !== undefined) { fields.push('state = ?'); params.push(state); }
    if (country !== undefined) { fields.push('country = ?'); params.push(country); }
    if (!fields.length) return res.status(400).json({ error: 'Nenhum campo para atualizar.' });

    fields.push('updatedAt = NOW()');
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    params.push(id);

    await pool.query(sql, params);
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Usuário não encontrado' });
    const user = rows[0];
    user.birthDate = user.birthDate ? format(new Date(user.birthDate), 'dd-MM-yyyy') : null;
    res.json(user);
  } catch (err) {
    console.error('PUT /users/:id error:', err);
    if (err && err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Valor duplicado (cpf ou email já cadastrado).' });
    }
    res.status(500).json({ error: err.message });
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json({ message: 'Usuário deletado.' });
  } catch (err) {
    console.error('DELETE /users/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`🚀 Servidor rodando na porta ${port}`));

// Graceful shutdown
const shutdown = async () => {
  console.log('Shutting down server...');
  server.close(() => console.log('HTTP server closed'));
  try {
    await pool.end();
    console.log('DB pool closed');
  } catch (e) {
    console.error('Error closing DB pool', e);
  } finally {
    process.exit(0);
  }
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);