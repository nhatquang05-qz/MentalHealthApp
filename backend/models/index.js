
const sequelize = require('../config/db');
const User = require('./User');
const Mood = require('./Mood');
const TestResult = require('./TestResult');


User.hasMany(Mood, { foreignKey: 'userId' });
Mood.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(TestResult, { foreignKey: 'userId' });
TestResult.belongsTo(User, { foreignKey: 'userId' });

const db = {
  sequelize,
  User,
  Mood,
  TestResult
};

module.exports = db;