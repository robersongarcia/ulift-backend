const sequelize = require('../config/database.js');
const { DataTypes } = require('sequelize');
const localStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcryptjs');
const authSecret = require('./authSecret');
const { body, validationResult, check } = require('express-validator');

const User = require('../models/User.js')(sequelize,DataTypes);

module.exports = (passport) => {

passport.use('login',new localStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, 
    async (req, email, password, done) => {
        try{
            //validations
            body('email', 'Please include a valid email').exists().isEmail();
            body('password', 'Password is required').exists();
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return done(null, false, {message: 'dont pass validation', errors: errors.array()});
            }

            const user = await User.findOne({where: {email: email}});

            if (!user) {                
                return done(null, false, {message: 'Incorrect email'});
            }

            const validate = await bcrypt.compare(password, user.password);
            
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
          //validations
          body('email', 'Please include a valid email').exists().isEmail();
          body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 });
          body('name', 'Name is required').exists().isString();
          body('lastname', 'Lastname is required').exists().isString();
          body('ci', 'CI is required and need to be integer').exists().isInt();
          body('gender','gender is required').exists().isLength({max: 1}).isIn(['M','F']);
          
          if (!errors.isEmpty()) {
            return done(null, false, {message: 'dont pass validation', errors: errors.array()});
          }

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
            gender: req.gender
          });
          await newUser.save();
          // const id = 3;
          // const user2 = User.build({id:id,email: email, passwordU: password, nameU: req.body.name, lastname: req.body.lastname, ci: req.body.ci, gender: req.body.gender});
          // await user.save();

          return done(null, newUser, { message: 'User created succesfuly' });
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
