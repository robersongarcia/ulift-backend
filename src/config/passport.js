const sequelize = require('../config/database.js');
const { DataTypes, UUIDV4 } = require('sequelize');
const localStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcryptjs');
const authSecret = require('./authSecret');
const fs = require("fs");
const { sendEmail } = require('./mail.config.js');
const { getToken, getTokenData } = require('./jwt.config.js');
const passport = require('passport');

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

          if(req.file == undefined){
            return done(null, false, {message: 'Please upload a profile image'});
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
            gender: req.body.gender,
            role: req.body.role,
            photo: 'images/'+req.file.filename,
            emergencyContact: req.body.emergencyContact,
            emergencyName: req.body.emergencyName
          });
          
          console.log(newUser);

          const code = UUIDV4();
          const token = getToken({ email, code });

          await sendEmail(email,'Pruebita',req.body.name,token);

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
      const user = await User.findOne({where:{id: jwt_payload.id, email: jwt_payload.email}});
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

passport.use('confirm',new localStrategy({},
  async (req, res) => {
    try {
      const {token} = req.params;
            
      const data = await getTokenData(token);
        
      if(data === null){
        return res.json({
          success: false,
          message: 'Error al obtener data'
        });
      }
        
      const { email, code } = data.data;
        
      const user = await User.findOne({ email }) || null;
        
      if(user === null){
        return res.json({
          success: false,
          message: 'Error al obtener usuario'
        });
      }
        
      if(code !== user.code){
        return res.redirect('/error.html');
      }
        
      newUser.verified = true;
      await newUser.save();
      return res.redirect('/confirm.html');  
    
        } catch (error) {
    
          console.log(error);
          return res.json({
                success: false,
                message: 'Error al confirmar'
            
          })
        }
}));