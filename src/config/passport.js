const sequelize = require('../config/database.js');
const { DataTypes } = require('sequelize');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const User = require('../models/User.js')(sequelize,DataTypes);

module.exports = (passport) => {

passport.use('login',new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, 
    async (email, password, done) => {
        console.log('email: '+email+' password: '+password);
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

// passport.use(new JWTStrategy({
//     jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
//     secretOrKey : 'clavesecreta'
// },
// function (jwtPayload, cb) {

//     return User.findOne({where:{ id: jwtPayload.id}})
//         .then(user => {
//             return cb(null, user);
//         })
//         .catch(err => {
//             return cb(err);
//         });
// }
// ));


};
