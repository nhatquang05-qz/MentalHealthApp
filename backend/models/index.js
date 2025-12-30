const sequelize = require('../config/db');
const User = require('./User');
const Mood = require('./Mood');
const TestResult = require('./TestResult');
const Gratitude = require('./Gratitude'); 


User.hasMany(Mood, { foreignKey: 'userId' });
Mood.belongsTo(User, { foreignKey: 'userId' });


User.hasMany(TestResult, { foreignKey: 'userId' });
TestResult.belongsTo(User, { foreignKey: 'userId' });


User.hasMany(Gratitude, { foreignKey: 'userId' });
Gratitude.belongsTo(User, { foreignKey: 'userId' });

const db = {
  sequelize,
  User,
  Mood,
  TestResult,
  Gratitude 
};

module.exports = db;