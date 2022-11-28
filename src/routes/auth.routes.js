const express = require('express');
const router = express.Router();
const { postLogin, postSignup } = require('../controllers/auth.controller');
const { validatePostSignup, validatePostLogin } = require('../helpers/validations');
const upload  = require('../helpers/multer');

router.post('/login', validatePostLogin ,postLogin);

router.post('/signup', upload.single('photo') , validatePostSignup , postSignup);

module.exports = router;