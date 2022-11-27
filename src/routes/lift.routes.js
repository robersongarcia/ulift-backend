const express = require('express');
const router = express.Router();
const { getMatch } = require('../controllers/lift.controller');


router.get('/match/:lat/:lng', getMatch);

module.exports = router;