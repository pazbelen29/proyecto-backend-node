const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Pedido = require('./Pedido');

// Definir relación 1:N (Un usuario tiene muchos pedidos)
Usuario.hasMany(Pedido, { foreignKey: 'usuarioId', as: 'pedidos' });
Pedido.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

module.exports = {
  sequelize,
  Usuario,
  Pedido
};