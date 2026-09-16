const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Acceso denegado: Token no proporcionado' });
  }

  try {
    const verificado = jwt.verify(token, process.env.JWT_SECRET || 'secreto_alkemy_2026');
    req.usuario = verificado;
    next();
  } catch (error) {
    res.status(403).json({ status: 'error', message: 'Token inválido o expirado' });
  }
};

module.exports = verificarToken;