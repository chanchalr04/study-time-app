const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  avatar: {
    type: String,
    default: 'default-avatar.png'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  studyStreak: {
    type: Number,
    default: 0
  },
  lastActiveDate: {
    type: Date
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light'
    },
    notifications: {
      type: Boolean,
      default: true
    },
    dailyReminderTime: {
      type: String,
      default: '09:00'
    }
  }
}, {
  timestamps: true
});

// 🔥 FIXED HASHING (IMPORTANT)
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const saltRounds = process.env.BCRYPT_SALT_ROUNDS
      ? parseInt(process.env.BCRYPT_SALT_ROUNDS)
      : 10;

    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update streak method
userSchema.methods.updateStreak = function() {
  const today = new Date().toDateString();
  const lastActive = this.lastActiveDate ? this.lastActiveDate.toDateString() : null;

  if (lastActive === today) {
    return this.studyStreak;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (lastActive === yesterday.toDateString()) {
    this.studyStreak += 1;
  } else {
    this.studyStreak = 1;
  }

  this.lastActiveDate = new Date();
  return this.studyStreak;
};

module.exports = mongoose.model('User', userSchema);
