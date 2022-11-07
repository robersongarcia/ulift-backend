const sequelize = require('../config/database.js');
const { DataTypes } = require('sequelize');
const localStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcryptjs');
const authSecret = require('./authSecret');

const User = require('../models/User.js')(sequelize,DataTypes);

module.exports = (passport) => {

passport.use('login',new localStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, 
    async (email, password, done) => {
        try{
            const user = await User.findOne({where: {email: email, passwordU: password}});
            if (!user) {                
                return done(null, false, {message: 'Incorrect email or password.'});
            }

            return done(null, user, { message: 'Logged in Successfully' });
        }
        catch (error) {
            return done(error);
        }
        
}));

passport.use(
    'signup',
    new localStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
      },
      async (req, email, password, done) => {
        try {
          //AJUSTAR PARA EL AUTO INCRMENT
          const id = 3;
          const user = User.build({id:id,email: email, passwordU: password, nameU: req.body.name, lastname: req.body.lastname, ci: req.body.ci, gender: req.body.gender});
          await user.save();

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  var opts = {};
  opts.jwtFromRequest = ExtractJWT.fromBodyField('token');
  opts.secretOrKey = authSecret;
  passport.use(new JWTstrategy(opts, async (jwt_payload, done) => {
    try{
      const user = await User.findOne({where:{id: jwt_payload.id}});
      if (user) {
        return done(null, user);
      } else {
          return done(null, false);
      }
    }catch(err){
      return done(err,false);
    }

  }));


};
