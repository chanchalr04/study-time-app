const express = require('express');
const router = express.Router();

const validate = require('../middleware/validate');
const { auth } = require('../middleware/auth');

const {
  registerValidator,
  loginValidator
} = require('../utils/validators');

const {
  register,
  login,
  getMe,
  logout
} = require('../controllers/auth.controller');

// REGISTER
router.post(
  '/register',
  registerValidator,
  validate,
  register
);

// LOGIN
router.post(
  '/login',
  loginValidator,
  validate,
  login
);

// PROTECTED
router.get('/me', auth, getMe);
router.post('/logout', auth, logout);

module.exports = router;
