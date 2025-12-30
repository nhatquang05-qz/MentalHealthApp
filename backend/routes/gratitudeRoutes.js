const express = require('express');
const router = express.Router();
const gratitudeController = require('../controllers/gratitudeController');
const upload = require('../config/cloudinary'); 


router.post('/', upload.single('image'), gratitudeController.createGratitude);


router.get('/:userId', gratitudeController.getGratitudeByUser);


router.delete('/:id', gratitudeController.deleteGratitude);

module.exports = router;