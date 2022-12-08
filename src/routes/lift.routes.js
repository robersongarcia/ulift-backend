const express = require('express');
const router = express.Router();
const { getMatch, createLift } = require('../controllers/lift.controller');


router.get('/match/:lat/:lng', getMatch);

router.post('/', createLift)

module.exports = router;