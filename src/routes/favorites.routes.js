const express = require('express');
const router = express.Router();
const { getFavorites } = require('../controllers/favorites.controller'); 

router.get('/', getFavorites); 

module.exports = router;