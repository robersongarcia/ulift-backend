const { body, validationResult } = require("express-validator");

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

const validatePostSignup = validate([
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
      .isLength({ min:10  , max: 14}).withMessage('emergencyContact must be 11 characters minimum').bail()
]);

const validatePostLogin = validate([
    body('email')
      .exists().isEmail().withMessage('invalid email').bail(),
    body('password')
      .exists().isString().isLength({max:20, min:6}).withMessage('invalid password').bail()
]);

module.exports = {
    validatePostSignup,
    validatePostLogin,
    validate
}