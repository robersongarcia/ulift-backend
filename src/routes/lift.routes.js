const express = require('express');
const router = express.Router();
const { getMatch, createLift, getLiftRequests, acceptLiftRequest, postRequestLift, cancelLift, cancelRequest, getPassengers, liftCompleteCheck, driverCheck } = require('../controllers/lift.controller');


router.get('/match/:wOnly/:lat/:lng/:maxD', getMatch);

router.post('/', createLift);

router.get('/requests', getLiftRequests);

router.post('/accept', acceptLiftRequest);

router.post('/request', postRequestLift);

router.delete('/cancel', cancelLift);

router.delete('/request', cancelRequest);

router.get('/passengers/:liftID', getPassengers);

router.post('/complete', liftCompleteCheck);

router.post('/driverCheck/:passengerID', driverCheck);

module.exports = router;