const { verifyToken } = require('../config/jwt');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.replace('Bearer ', '');

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token.'
      });
    }

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found.'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated.'
      });
    }

    req.user = user;
    req.token = token;
    next();

  } catch {
    res.status(401).json({
      success: false,
      message: 'Authentication failed.'
    });
  }
};

module.exports = { auth };
