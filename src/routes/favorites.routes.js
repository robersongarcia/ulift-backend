const express = require('express');
const router = express.Router();
const { getFavorites, post, postFavorite } = require('../controllers/favorites.controller'); 

router.get('/', getFavorites); 

router.post('/', postFavorite);

module.exports = router;