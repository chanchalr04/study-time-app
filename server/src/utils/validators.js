const { body, param } = require('express-validator');

// Auth validators
const registerValidator = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email'),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email'),
  
  body('password')
    .notEmpty().withMessage('Password is required')
];

// Task validators
const taskValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Task title is required'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
  
  body('dueDate')
    .optional()
    .isISO8601().withMessage('Please provide a valid date'),
  
  body('estimatedDuration')
    .optional()
    .isInt({ min: 1 }).withMessage('Duration must be at least 1 minute')
];

// Goal validators
const goalValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Goal title is required'),
  
  body('targetValue')
    .notEmpty().withMessage('Target value is required')
    .isFloat({ min: 1 }).withMessage('Target must be at least 1'),
  
  body('endDate')
    .notEmpty().withMessage('End date is required')
    .isISO8601().withMessage('Please provide a valid date')
];

// Session validators
const sessionValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Session title is required')
];

// ID validator
const idValidator = [
  param('id')
    .isMongoId().withMessage('Invalid ID format')
];

module.exports = {
  registerValidator,
  loginValidator,
  taskValidator,
  goalValidator,
  sessionValidator,
  idValidator
};