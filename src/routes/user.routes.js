const express = require('express');
const router = express.Router();
const {getProfile , postVehicle, getVehicles} = require('../controllers/user.controller'); 
const {validatePostVehicle} = require('../helpers/validations');

router.get('/profile',getProfile);

router.post('/vehicle', validatePostVehicle , postVehicle);

router.get('/vehicle', getVehicles);

module.exports = router;