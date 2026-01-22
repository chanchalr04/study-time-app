const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Goal title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetValue: {
    type: Number,
    required: true,
    min: [1, 'Target must be at least 1']
  },
  currentValue: {
    type: Number,
    default: 0
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'archived'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Calculate progress before saving
goalSchema.pre('save', function(next) {
  if (this.targetValue > 0) {
    this.progress = Math.min(100, Math.round((this.currentValue / this.targetValue) * 100));
    
    if (this.progress >= 100 && this.status === 'active') {
      this.status = 'completed';
    }
  }
  next();
});

module.exports = mongoose.model('Goal', goalSchema);