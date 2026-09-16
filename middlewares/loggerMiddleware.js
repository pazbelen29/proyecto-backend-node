const fs = require('fs');
const path = require('path');

const loggerMiddleware = (req, res, next) => {
    const now = new Date();
    const fecha = now.toISOString().split('T')[0];
    const hora = now.toTimeString().split(' ')[0];
    const logMessage = `[${fecha} ${hora}] Muestra acceso a la ruta: ${req.method} ${req.url}\n`;

    const logPath = path.join(__dirname, '../logs/log.txt');

    fs.appendFile(logPath, logMessage, (err) => {
        if (err) {
            console.error('Error al escribir en el log:', err);
        }
    });

    next();
};

module.exports = loggerMiddleware;