
const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');


router.post('/mood', dataController.saveMood);
router.get('/mood/:userId', dataController.getMoodHistory);

router.post('/test-result', dataController.saveTestResult);
router.get('/test-result/:userId', dataController.getTestHistory);

module.exports = router;