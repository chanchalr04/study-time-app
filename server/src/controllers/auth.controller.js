const User = require('../models/User');
const { generateToken } = require('../config/jwt');

// Input validation middleware (add this to your routes)
const validateRegister = (req, res, next) => {
  const { username, email, password, firstName, lastName } = req.body;
  const errors = [];

  if (!username || username.trim().length < 3) {
    errors.push('Username must be at least 3 characters long');
  }
  
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Valid email is required');
  }
  
  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  if (!firstName || firstName.trim().length === 0) {
    errors.push('First name is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || email.trim().length === 0) {
    errors.push('Email is required');
  }
  
  if (!password || password.trim().length === 0) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

const register = async (req, res) => {
  try {
    console.log('Register request body:', req.body);
    
    const { username, email, password, firstName, lastName } = req.body;

    // Check if user exists - optimized single query
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: existingUser.email === email 
          ? 'User already exists with this email' 
          : 'Username already taken',
        field: existingUser.email === email ? 'email' : 'username'
      });
    }

    // Create user with password hashing (ensure this happens in User model)
    const user = await User.create({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password, // Password should be hashed in User model pre-save hook
      firstName: firstName.trim(),
      lastName: lastName.trim()
    });

    // Generate token with error handling
    let token;
    try {
      token = generateToken(user._id);
    } catch (tokenError) {
      console.error('Token generation error:', tokenError);
      // Delete user if token generation fails (optional)
      await User.findByIdAndDelete(user._id);
      throw new Error('Authentication failed. Please try again.');
    }

    // Remove password from user object
    const userResponse = user.toObject();
    delete userResponse.password;

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
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Register error details:');
    console.error('- Message:', error.message);
    console.error('- Stack:', error.stack);
    
    // Handle duplicate key errors specifically
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        success: false,
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
        field
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const login = async (req, res) => {
  try {
    console.log('Login request body:', req.body);
    
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email (case-insensitive)
    const user = await User.findOne({ 
      email: email.toLowerCase().trim() 
    }).select('+password'); // Explicitly select password field

    if (!user) {
      console.log('Login failed: User not found for email:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user account is active
    if (user.status && user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Account is not active. Please contact support.'
      });
    }

    // Check password
    let isPasswordValid;
    try {
      isPasswordValid = await user.comparePassword(password);
    } catch (compareError) {
      console.error('Password comparison error:', compareError);
      throw new Error('Authentication failed');
    }

    if (!isPasswordValid) {
      console.log('Login failed: Invalid password for user:', user.email);
      // Optional: Track failed login attempts
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      user.lastFailedLogin = new Date();
      await user.save();
      
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        attempts: user.failedLoginAttempts
      });
    }

    // Reset failed login attempts on successful login
    user.failedLoginAttempts = 0;
    user.lastLogin = new Date();
    
    // Update streak if method exists
    if (typeof user.updateStreak === 'function') {
      user.updateStreak();
    }
    
    await user.save();

    // Generate token
    let token;
    try {
      token = generateToken(user._id);
    } catch (tokenError) {
      console.error('Token generation error:', tokenError);
      throw new Error('Authentication failed');
    }

    // Prepare user response without sensitive data
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.failedLoginAttempts;

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
        studyStreak: user.studyStreak || 0,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Login error details:');
    console.error('- Message:', error.message);
    console.error('- Stack:', error.stack);
    
    // Handle specific errors
    if (error.message.includes('Authentication failed')) {
      return res.status(500).json({
        success: false,
        message: 'Authentication service error'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    // Refresh user data from database to get latest
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
        studyStreak: user.studyStreak || 0,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const logout = async (req, res) => {
  try {
    // If using token blacklisting, you would add the token to a blacklist here
    // await TokenBlacklist.create({ token: req.token, expiresAt: new Date(req.user.exp * 1000) });
    
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Optional: Refresh token endpoint
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    // Verify refresh token and generate new access token
    // Implementation depends on your jwt config
    
    res.status(200).json({
      success: true,
      token: 'new-access-token',
      refreshToken: 'new-refresh-token' // if rotating refresh tokens
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token'
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout,
  refreshToken,
  validateRegister,
  validateLogin
};