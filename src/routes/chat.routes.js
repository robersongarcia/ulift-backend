const express = require('express');
const router = express.Router();
const { getChat } = require('../controllers/chat.controller'); 

router.get('/send', getSenders);
router.get('/receive', getReceivers);
router.get('/', getChat);
router.post('/sendMessage', sendMessage);

module.exports = router;