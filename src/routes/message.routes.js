const express = require('express');
const router = express.Router();
const { getAllMessages, getMessage } = require('../controllers/message.controller'); 

router.get('/', getAllMessages);
router.get('/', getMessage);

module.exports = router;