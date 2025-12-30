const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const db = require('./models');
const authRoutes = require('./routes/authRoutes');
const dataRoutes = require('./routes/dataRoutes');
const gratitudeRoutes = require('./routes/gratitudeRoutes');
const contactRoutes = require('./routes/contactRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/gratitude', gratitudeRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/', (req, res) => {
  res.send('Mental Health App Backend is running...');
});

db.sequelize.sync({ alter: true }).then(() => {
  console.log('Database synced.');
  app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
  });
}).catch((err) => {
  console.error('Database connection failed:', err);
});