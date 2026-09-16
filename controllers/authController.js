const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registro = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    const nuevoUsuario = await Usuario.create({ nombre, email, password });
    res.status(201).json({ status: 'success', message: 'Usuario registrado con éxito', data: { id: nuevoUsuario.id, nombre, email } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(401).json({ status: 'error', message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET || 'secreto_alkemy_2026',
      { expiresIn: '2h' }
    );

    res.json({ status: 'success', message: 'Autenticación exitosa', token });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};