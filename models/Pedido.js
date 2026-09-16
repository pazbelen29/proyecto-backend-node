const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pedido = sequelize.define('Pedido', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  producto: {
    type: DataTypes.STRING,
    allowNull: false
  },
  monto: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = Pedido;