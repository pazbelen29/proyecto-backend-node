const express = require('express');
const path = require('path');
const { sequelize } = require('./models');
const loggerMiddleware = require('./middlewares/loggerMiddleware');
const mainRoutes = require('./routes/mainRoutes');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(loggerMiddleware);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Rutas
app.use('/', mainRoutes);
app.use('/api', userRoutes);

// Conectar DB y Servidor
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión exitosa a la base de datos PostgreSQL.');
    return sequelize.sync({ alter: true }); // Sincroniza tablas automáticamente
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Error al conectar a la base de datos:', err);
  });