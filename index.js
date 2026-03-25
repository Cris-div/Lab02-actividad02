const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

app.use(express.static(__dirname));

// CONEXIÓN A POSTGRESQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Ruta principal
app.get('/', (req, res) => {
  res.send('API con PostgreSQL funcionando 🚀');
});

// GET usuarios
app.get('/usuarios', async (req, res) => {
  const result = await pool.query('SELECT * FROM usuarios');
  res.json(result.rows);
});

// POST usuario
app.post('/usuarios', async (req, res) => {
  const { nombre, correo, edad, ciudad } = req.body;

  await pool.query(
    'INSERT INTO usuarios(nombre, correo, edad, ciudad) VALUES($1,$2,$3,$4)',
    [nombre, correo, edad, ciudad]
  );

  res.json({ mensaje: 'Usuario creado' });
});

// PUT usuario
app.put('/usuarios/:id', async (req, res) => {
  const { nombre, correo, edad, ciudad } = req.body;
  const { id } = req.params;

  await pool.query(
    'UPDATE usuarios SET nombre=$1, correo=$2, edad=$3, ciudad=$4 WHERE id=$5',
    [nombre, correo, edad, ciudad, id]
  );

  res.json({ mensaje: 'Usuario actualizado' });
});

// DELETE usuario
app.delete('/usuarios/:id', async (req, res) => {
  const { id } = req.params;

  await pool.query('DELETE FROM usuarios WHERE id=$1', [id]);

  res.json({ mensaje: 'Usuario eliminado' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});