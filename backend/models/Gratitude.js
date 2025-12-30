const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Gratitude = sequelize.define('Gratitude', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  content: { 
    type: DataTypes.TEXT,
    allowNull: true
  },
  imageUrl: { 
    type: DataTypes.STRING,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = Gratitude;