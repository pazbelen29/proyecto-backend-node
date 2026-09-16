const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const sequelize = require('./config/database');
require('./models');

const mainRoutes = require('./routes/mainRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const loggerMiddleware = require('./middlewares/loggerMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Crear carpeta uploads si no existe
const uploadsDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(uploadsDir));

app.use('/', mainRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', userRoutes);

app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Ruta no encontrada' });
});

sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Conexión exitosa a la base de datos PostgreSQL.');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Error al conectar a la base de datos:', err);
  });