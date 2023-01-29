const { DataTypes } = require('sequelize');
const { db } = require('../database/db');

const Repairs = db.define('repairs', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending',
    enum: ['pending', 'completed', 'cancelled'],
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

//!NOS FALTA EXPORTAR Y LUEGO CONFIGURAR LOS CONTROLADORES
// Preguntas con respecto a repairs:
//1. enum no está funcionando, realmente es enum quien me controla los tipos de datos que manejamos????

module.exports = Repairs;
