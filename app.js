require('dotenv').config();
const express = require('express');
const path = require('path');
const loggerMiddleware = require('./middlewares/loggerMiddleware');
const mainRoutes = require('./routes/mainRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(loggerMiddleware);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use('/', mainRoutes);

app.listen(PORT, () => {
    console.log(`Servidor iniciado exitosamente en http://localhost:${PORT}`);
});