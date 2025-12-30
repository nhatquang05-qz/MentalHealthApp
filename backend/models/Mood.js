
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Mood = sequelize.define('Mood', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: { 
    type: DataTypes.INTEGER,
    allowNull: false
  },
  moodLevel: { 
    type: DataTypes.STRING,
    allowNull: false
  },
  note: { 
    type: DataTypes.TEXT,
    allowNull: true
  },
  date: { 
    type: DataTypes.DATEONLY, 
    defaultValue: DataTypes.NOW
  }
});

module.exports = Mood;