const express = require('express');
const { askAI, testAI } = require('../controllers/aiController');

const router = express.Router();

router.post('/chat', askAI);
router.post('/recommend', askAI);
router.post('/test', testAI);

module.exports = router;