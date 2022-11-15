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
        passwordField: 'password',
    }, 
    async (email, password, done) => {
        try{

            const user = await User.findOne({where: {email: email}});

            if (!user) {                
                return done(null, false, {message: 'User not found'});
            }

            const validate = await bcrypt.compare(password, user.passwordU);
            
            if (!validate) {
              return done(null, false, {message: 'Incorrect password'});
            }

            return done(null, user, { message: 'Logged in Successfully' });
        }
        catch (error) {
            return done(error);
        }
        
}));

passport.use('signup',new localStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
      },
      async (req, email, password, done) => {
        try {
          const user = await User.findOne({where: {email: email}});
          if (user) {
            return done(null, false, { message: 'User already exists' });
          }

          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);
          
          const newUser = User.build({
            email: email,
            passwordU: hashedPassword,
            nameU: req.body.name,
            lastname: req.body.lastname,
            ci: req.body.ci,
            gender: req.body.gender
          });
          
          // console.log(newUser);
          await newUser.save();

          return done(null, newUser, { message: 'User created succesfuly' });
        } catch (error) {
          return done(error);
        }
      }
    ) 
  );

  var opts = {};
  opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
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
