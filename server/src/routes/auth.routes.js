const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const validate = require('../middleware/validate');
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

// Public routes
router.post('/register', (req, res) => {
  console.log("✅ /api/auth/register route was HIT!");
  console.log("Request Body:", req.body);
  res.status(200).json({ 
    success: true, 
    message: "Route is working. Middleware bypassed." 
  });
});
router.post('/login', loginValidator, validate, login);

// Protected routes
router.get('/me', auth, getMe);
router.post('/logout', auth, logout);

module.exports = router;