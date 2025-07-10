// middlewares/auth.validation.js
const { body } = require('express-validator');

exports.registerValidation = [
   
  body('email').isEmail().withMessage('There is problem in email!!'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
   body('username').notEmpty().withMessage('username is required'),
      
];

exports.loginValidation = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required'),
];
