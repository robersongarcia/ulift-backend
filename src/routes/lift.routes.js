const express = require('express');
const router = express.Router();
const { getMatch, createLift, liftHistory } = require('../controllers/lift.controller');


router.get('/match/:lat/:lng', getMatch);

router.post('/', createLift)

router.get('/history', liftHistory);

module.exports = router;