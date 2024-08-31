const express = require('express');
const router = express.Router();
const { eventsHandler } = require('../controllers/sseController');

router.get('/orders', eventsHandler);

module.exports = router;
