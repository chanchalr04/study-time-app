const User = require('../models/User');
const { generateToken } = require('../config/jwt');

// REGISTER
exports.register = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username }
      ]
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email or username already exists'
      });
    }

    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password,
      firstName,
      lastName
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Register failed'
    });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase()
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

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
};

// GET ME
exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
};

// LOGOUT
exports.logout = async (req, res) => {
  res.json({ success: true });
};
