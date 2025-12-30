const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const db = require('./models');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const dataRoutes = require('./routes/dataRoutes');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);

app.get('/', (req, res) => {
  res.send('Mental Health App Backend is running...');
});



db.sequelize.sync({ force: false }).then(() => {
  console.log('Đã kết nối và đồng bộ với MySQL Database.');
  app.listen(PORT, () => {
    console.log(`Server đang chạy tại cổng: ${PORT}`);
  });
}).catch((err) => {
  console.error('Không thể kết nối Database:', err);
});