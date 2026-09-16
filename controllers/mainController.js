const getHome = (req, res) => {
    res.send('<h1>Bienvenido al servidor Node.js & Express</h1><p>Servidor en funcionamiento correcto.</p>');
};

const getStatus = (req, res) => {
    res.json({
        status: 'success',
        message: 'Servidor operando correctamente',
        timestamp: new Date()
    });
};

module.exports = {
    getHome,
    getStatus
};