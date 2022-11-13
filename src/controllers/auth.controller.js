const jwt = require('jsonwebtoken');
const passport = require('passport');
const authSecret = require('../config/authSecret');

const postLogin = async (req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {
        try {
            if (err) {
                const error = new Error('An error occurred.');
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
};

const postSignup = async (req, res, next) => {
    passport.authenticate('signup', { session: false },  async (err, user, info) => {
        try{
            if (err) {
            const error = new Error('An error occurred.');
            return next(error);
            }

            if(!user){
                const message = info.message;
                res.status(401).json({success: false, message});
                return
            }

            req.login(user,{ session: false }, async (error) => {
                if (error) return next(error);
                const message = info.message;
                const body = { id: user.dataValues.id, email: user.dataValues.email};
                const token = jwt.sign( body, authSecret);

                return res.json({success: true, token, user, message});
            });
        }
        catch(error){
          return next(error);
        }
    })(req, res, next);
};

module.exports = {
    postLogin,
    postSignup
};