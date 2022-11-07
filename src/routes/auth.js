const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const authSecret = require('../config/authSecret');

// hola roberson xdxdd y no hay casi lag alv brutal

router.post(
    '/login',
    async (req, res, next) => {
        passport.authenticate('login', async (err, user, info) => {
            try {
                if (err) {
                    const error = new Error('An error occurred. Post /login');
                    return next(error);
                }

                if (!user){
                    const message = info.message;
                    res.status(401).json({success: false, message });
                    return;
                }

                req.login(user,{ session: false }, async (error) => {
                    if (error) return next(error);
    
                    const body = { id: user.dataValues.id, email: user.dataValues.email};
                    const token = jwt.sign( body, authSecret);
    
                    return res.json({success: true, token});
                });
          }catch (error) {
            return next(error);
          }
        }
        )(req, res, next);
    }
  );

router.post(
    '/signup',
    async (req, res, next) => {

      passport.authenticate('signup', { session: false },  async (err, user) => {
        try{
        if(err){
          res.status(500).json({success: false, message:'Signup unsuccessful'});
          return
        }

        res.json({
          message: 'Signup successful',
          user,
        });
        }
        catch(error){
          return next(error);
        }
      })(req, res, next);

    }
  );

module.exports = router;