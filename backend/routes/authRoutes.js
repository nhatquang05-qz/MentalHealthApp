const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const upload = require('../config/cloudinary'); 

router.post('/register', authController.register);
router.post('/login', authController.login);
router.put('/update', upload.single('avatar'), authController.updateProfile); 

module.exports = router;