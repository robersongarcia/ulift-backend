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
  
      res.status(400).json({ errors: errors.array() });
    };
};

const validatePostSignup = validate([
    body('email', 'Please include a valid email').exists().isEmail(),
    body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    body('name', 'Name is required').exists().isString(),
    body('lastname', 'Lastname is required').exists().isString(),
    body('ci', 'CI is required and need to be integer').exists().isInt(),
    body('gender','gender is required').exists().isLength({max: 1}).isIn(['M','F'])
]);

const validatePostLogin = validate([body('email', 'Please include a valid email').exists().isEmail(),
body('password', 'Password is required').exists(),]);

module.exports = {
    validatePostSignup,
    validatePostLogin,
    validate
}