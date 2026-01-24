const User = require('../models/User');
const { generateToken } = require('../config/jwt');

/* =========================
   REGISTER CONTROLLER
========================= */
const register = async (req, res) => {
  try {
    console.log('REGISTER BODY:', req.body);

    const { username, email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase().trim() },
        { username: username.trim() }
      ]
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          existingUser.email === email.toLowerCase().trim()
            ? 'Email already registered'
            : 'Username already taken'
      });
    }

    // Create new user (password hashing via User model)
    const user = await User.create({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password,
      firstName: firstName.trim(),
      lastName: lastName.trim()
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('REGISTER ERROR:', error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        success: false,
        message: `${field} already exists`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
};

/* =========================
   LOGIN CONTROLLER
========================= */
const login = async (req, res) => {
  try {
    console.log('LOGIN BODY:', req.body);

    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase().trim()
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error('LOGIN ERROR:', error);

    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
};

/* =========================
   GET CURRENT USER
========================= */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('GET ME ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user'
    });
  }
};

/* =========================
   LOGOUT
========================= */
const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

module.exports = {
  register,
  login,
  getMe,
  logout
};
