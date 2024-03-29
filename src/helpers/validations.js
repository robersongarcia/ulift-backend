const { body, validationResult } = require("express-validator");
const fs = require("fs");
const { isString } = require("util");

const validate = validations => {
    return async (req, res, next) => {
      for (let validation of validations) {
        const result = await validation.run(req);
        if (result.errors.length) break;
      }
  
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }
  
      res.status(400).json({success: false, message: 'some validations failed' ,errors: errors.array() });
    };
};

const validateSignUp = validations => {
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    //delete user photo
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error(err)
        return
      }
    });

    res.status(400).json({success: false, message: 'some validations failed' ,errors: errors.array() });
  };
};

const validatePostSignup = validateSignUp([
    body('email')
      .exists().withMessage('email is required').bail()
      .isEmail().withMessage('invalid email').bail()
      .custom(value => {
        if(!(value.includes('@est.ucab.edu.ve')) && !(value.includes('@ucab.edu.ve'))) {
            throw new Error('Invalid email');
        }
        else 
            return true;
        }).withMessage('Invalid email, must include @est.ucab.edu.ve or @ucab.edu.ve').bail(),
    
    body('password')
      .exists().withMessage('password is required').bail()
      .isString().withMessage('invalid password').bail()
      .isLength({ min: 6 , max: 20}).withMessage('password must be between 6 and 20 characters').bail(),
    
    body('name')
      .exists().withMessage('name is required').bail()
      .isString().withMessage('invalid name').bail()
      .isLength({ min: 2 , max: 30}).withMessage('name must be between 2 and 30 characters').bail(),

    body('lastname')
      .exists().withMessage('lastname is required').bail()
      .isString().withMessage('invalid lastname').bail()
      .isLength({ min: 2 , max: 30}).withMessage('lastname must be between 2 and 30 characters').bail(),

    body('role')
      .exists().withMessage('role is required').bail()
      .isString().withMessage('invalid role').bail()
      .isLength({max: 1}).isIn(['E','P','T']).withMessage('invalid role').bail(),

    body('gender')
      .exists().withMessage('gender is required').bail()
      .isString().withMessage('invalid gender').bail()
      .isLength({max: 1}).isIn(['M','F']),

    body('emergencyContact')
      .exists().withMessage('emergencyContact is required').bail()
      .isString().withMessage('invalid emergencyContact').bail()
      .isLength({ min:10  , max: 14}).withMessage('emergencyContact must be 11 characters minimum').bail(),

    body('emergencyName')
      .exists().withMessage('emergencyName is required').bail()
      .isString().withMessage('invalid emergencyName').bail()
      .isLength({ min:2  , max: 20}).withMessage('emergencyContact must be 2 characters minimum and 20 maximum').bail(),

    body('lat')
        .exists().withMessage('lat is required').bail()
        .isString().withMessage('invalid lat').bail(),

    body('lng')
        .exists().withMessage('lng is required').bail()
        .isString().withMessage('invalid lng').bail()
    
]);

const validatePostLogin = validate([
    body('email')
      .exists().isEmail().withMessage('invalid email').bail(),
    body('password')
      .exists().isString().isLength({max:20, min:6}).withMessage('invalid password').bail()
]);

const validatePostVehicle = validate([
    body('plate')
      .exists().withMessage('plate is required').bail()
      .isString().withMessage('invalid plate').bail()
      .isLength({ min: 7 , max: 7}).withMessage('plate must be 6 characters').bail(),
    
    body('model')
      .exists().withMessage('model is required').bail()
      .isString().withMessage('invalid model').bail()
      .isLength({ min: 2 , max: 20}).withMessage('model must be between 2 and 20 characters').bail(),

    body('color')
      .exists().withMessage('color is required').bail()
      .isString().withMessage('invalid color').bail()
      .isLength({ min: 2 , max: 10}).withMessage('color must be between 2 and 10 characters').bail(),

    body('seats')
      .exists().withMessage('seats is required').bail()
      .isInt().withMessage('invalid seats').bail()
      .custom(value => {
        if(value < 1 || value > 8) { 
            throw new Error('invalid seats');
        }
        else
            return true;
        }).withMessage('invalid seats').bail()
]);



module.exports = {
    validatePostSignup,
    validatePostLogin,
    validate,
    validatePostVehicle
}