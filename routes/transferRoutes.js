const express = require('express');
const router = express.Router();
const transferController = require('../controllers/transferController');

router.post('/transfer', transferController.transferAmount);

module.exports = router;
