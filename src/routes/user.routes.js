const express = require('express');
const router = express.Router();
const {getProfile , postVehicle, getVehicles, getRoutes, postRoute, getDestination, postDestination} = require('../controllers/user.controller'); 
const {validatePostVehicle} = require('../helpers/validations');

router.get('/profile',getProfile);

router.post('/vehicle', validatePostVehicle , postVehicle);

router.get('/vehicle', getVehicles);

router.get('/route', getRoutes);

router.post('/route', postRoute);

router.get('/destination', getDestination);

router.post('/destination', postDestination);

module.exports = router;