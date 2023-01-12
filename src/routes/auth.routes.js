const express = require('express');
const router = express.Router();
const { postLogin, postSignup, confirmMethod} = require('../controllers/auth.controller');
const { validatePostSignup, validatePostLogin } = require('../helpers/validations');
const upload  = require('../helpers/multer');
const sequelize = require('../config/database.js');
const { DataTypes} = require('sequelize');
const { getTokenData } = require('../config/jwt.config');
const User = require('../models/User')(sequelize, DataTypes);
const Confirmation_Token = require('../models/Confirmation_Token')(sequelize, DataTypes);

router.post('/login', validatePostLogin ,postLogin);

router.post('/signup', upload.single('photo') , validatePostSignup , postSignup);

router.get('/verify', function(req, res) {
    console.log("hola")
    token = req.query.email;
    if (token) {
        try {
            const email = getTokenData(token);
            console.log((email.data.email));
            if (User.update({verified: 1},{where: {email: email.data.email}})) 
            try{
                res.status(200).json({
                    message: 'Your account has been verified.'
            })
        } catch (error) {
                return res.status(500).json({
                    message: 'Something went wrong. Please try again.'
                })
            }  
            Confirmation_Token.destroy({where: {token: token}});
        } catch (error) {
            return res.status(500).json({
                message: 'Something went wrong. Please try again.'
            })
        }
    }
});
    
module.exports = router;