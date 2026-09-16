const { Usuario, Pedido, sequelize } = require('../models');

// Obtener todos los usuarios con sus pedidos
exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      include: [{ model: Pedido, as: 'pedidos' }]
    });
    res.json({ status: 'éxito', data: usuarios });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Crear usuario simple
exports.crearUsuario = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    const nuevoUsuario = await Usuario.create({ nombre, email, password });
    res.status(201).json({ status: 'éxito', data: nuevoUsuario });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// Crear usuario con pedido (Transacción)
exports.crearUsuarioConPedido = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { nombre, email, password, producto, monto } = req.body;
    const nuevoUsuario = await Usuario.create({ nombre, email, password }, { transaction: t });
    const nuevoPedido = await Pedido.create({ producto, monto, usuarioId: nuevoUsuario.id }, { transaction: t });

    await t.commit();
    res.status(201).json({ status: 'éxito', data: { usuario: nuevoUsuario, pedido: nuevoPedido } });
  } catch (error) {
    await t.rollback();
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// Actualizar usuario
exports.actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const [actualizado] = await Usuario.update(req.body, { where: { id } });
    if (!actualizado) {
      return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
    }
    res.json({ status: 'éxito', message: 'Usuario actualizado correctamente' });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// Eliminar usuario
exports.eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Usuario.destroy({ where: { id } });
    if (!eliminado) {
      return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
    }
    res.json({ status: 'éxito', message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};