const { Usuario, Pedido, sequelize } = require('../models');

// GET /usuarios - Obtener usuarios con sus pedidos (ORM & Relaciones)
const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [{ model: Pedido, as: 'pedidos', attributes: ['id', 'producto', 'monto'] }]
    });
    res.json({ status: 'success', data: usuarios });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// POST /usuarios - Crear usuario
const createUsuario = async (req, res) => {
  try {
    const { nombre, email } = req.body;
    const nuevoUsuario = await Usuario.create({ nombre, email });
    res.status(201).json({ status: 'success', data: nuevoUsuario });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// PUT /usuarios/:id - Actualizar usuario
const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email } = req.body;
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
    }

    await usuario.update({ nombre, email });
    res.json({ status: 'success', message: 'Usuario actualizado correctamente', data: usuario });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// DELETE /usuarios/:id - Eliminar usuario
const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
    }

    await usuario.destroy();
    res.json({ status: 'success', message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// POST /usuarios/transaccion - Operación con Transacción (Rollback si falla)
const createUsuarioConPedido = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { nombre, email, producto, monto } = req.body;

    const usuario = await Usuario.create({ nombre, email }, { transaction: t });
    const pedido = await Pedido.create({ producto, monto, usuarioId: usuario.id }, { transaction: t });

    await t.commit();
    res.status(201).json({
      status: 'success',
      message: 'Transacción completada exitosamente',
      data: { usuario, pedido }
    });
  } catch (error) {
    await t.rollback();
    res.status(400).json({
      status: 'error',
      message: 'Transacción cancelada (Rollback ejecutado)',
      error: error.message
    });
  }
};

module.exports = {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  createUsuarioConPedido
};