
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TestResult = sequelize.define('TestResult', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  testType: { 
    type: DataTypes.STRING,
    allowNull: false
  },
  score: { 
    type: DataTypes.INTEGER,
    allowNull: false
  },
  result: { 
    type: DataTypes.STRING,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = TestResult;