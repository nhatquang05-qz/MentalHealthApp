const sequelize = require('../config/db');
const User = require('./User');
const Mood = require('./Mood');
const TestResult = require('./TestResult');
const Gratitude = require('./Gratitude');
const Contact = require('./Contact'); 
const EmergencyContact = require('./EmergencyContact'); 
const Notification = require('./Notification');

User.hasMany(Mood, { foreignKey: 'userId' });
Mood.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(TestResult, { foreignKey: 'userId' });
TestResult.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Gratitude, { foreignKey: 'userId' });
Gratitude.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Contact, { foreignKey: 'userId' });
Contact.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(EmergencyContact, { foreignKey: 'userId', as: 'emergencyContacts' });
EmergencyContact.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });

const db = {
  sequelize,
  User,
  Mood,
  TestResult,
  Gratitude,
  Contact,
  EmergencyContact,
  Notification
};

module.exports = db;