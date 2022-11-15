const express = require('express');
const router = express.Router();
const { postLogin, postSignup } = require('../controllers/auth.controller');
const { validatePostSignup, validatePostLogin } = require('../helpers/validations');

router.post('/login', validatePostLogin ,postLogin);

router.post('/signup', validatePostSignup , postSignup);

module.exports = router;