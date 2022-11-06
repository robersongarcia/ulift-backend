
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');

/* POST login. */
// router.post('/login', (req, res, next) => {
//         console.log(req.body);
//     passport.authenticate('local', {session: false}, (err, user, info) => {

//         console.log('login --- '+user);
//         console.log(info);
//         if (user) {
//             const token = jwt.sign(user, 'clavesecreta');
//             return res.json({user, token});
//         }else{
//             return res.status(400).json({
//                 message: 'Something is not right',
//                 user : user
//             });            
//         }

        
        
//         // req.login(user, {session: false}, (err) => {
//         //         if (err) {
//         //             res.send(err);
//         //         }

//         // const token = jwt.sign(user, 'clavesecreta');
//         //         return res.json({user, token});
//         //         });
//     })(req, res);

// });

router.post(
    '/login',
    async (req, res, next) => {
        passport.authenticate('login', async (err, user, info) => {
            try {
                if (err || !user) {
                    const error = new Error('An error occurred.');
                    return next(error);
                }
  
                req.login(user,{ session: false }, async (error) => {
                    if (error) return next(error);
    
                    const body = { id: user.dataValues.id, email: user.dataValues.email};
                    const token = jwt.sign({ body }, 'clavesecreta');
    
                    return res.json({ token });
                });
          }catch (error) {
            return next(error);
          }
        }
        )(req, res, next);
    }
  );

module.exports = router;