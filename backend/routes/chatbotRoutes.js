const express = require('express');
const { saveChatbotMessage, getChatbotMessages } = require('../controllers/chatbotController');

const router = express.Router();

router.post('/save', saveChatbotMessage);
router.get('/', getChatbotMessages);

module.exports = router;
