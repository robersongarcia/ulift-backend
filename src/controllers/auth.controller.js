const jwt = require('jsonwebtoken');
const passport = require('passport');
const authSecret = require('../config/authSecret');
const fs = require("fs");

const postLogin = async (req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {
        try {
            if (err) {
                const error = new Error('An error occurred. Login');
                return next(error);
            }

            if (!user){
                const message = info.message;
                res.status(401).json({success: false, message });
                return;
            }

            req.login(user,{ session: false }, async (error) => {
                if (error) return next(error);

                const body = { id: user.id, email: user.email, nameU: user.nameU, lastname: user.lastname,};
                const token = jwt.sign( body, authSecret);

                return res.json({success: true, token});
            });
      }catch (error) {
        return next(error);
      }
    }
    )(req, res, next);
};

const postSignup = async (req, res, next) => {
    passport.authenticate('signup', { session: false },  async (err, user, info) => {
        try{
            if (err) {
                const error = new Error('An error occurred. Signup');
                return next(error);
            }
            const message = info.message;

            if(!user){
                res.status(401).json({success: false, message});
                return
            }

            return res.json({success: true, message});
        }
        catch(error){
          return next(error);
        }
    })(req, res, next);
};

const confirmMethod = async(req, res) => {
    passport.authenticate('confirm',  async (err, user, info) => {
        try{
            if (err) {
                const error = new Error('An error occurred. Confirm');
                return next(error);
            }

            const message = info.message;

            if(!user){
                res.status(401).json({success: false, message});
                return
            }

            return res.json({success: true, message});
        }
        catch(error){
            return next(error);
        }
    })(req, res);
};

module.exports = {
    postLogin,
    postSignup,
    confirmMethod
};