const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  title: {
    type: String,
    required: [true, 'Goal title is required'],
    trim: true,
    maxlength: [100, 'Goal title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    enum: ['study', 'exercise', 'health', 'career', 'personal', 'other'],
    default: 'study'
  },
  targetTime: {
    type: Number, // in minutes
    required: [true, 'Target time is required'],
    min: [1, 'Target time must be at least 1 minute']
  },
  currentTime: {
    type: Number,
    default: 0,
    min: 0
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  deadline: {
    type: Date,
    required: [true, 'Deadline is required']
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'failed', 'paused'],
    default: 'active'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  milestones: [{
    title: String,
    description: String,
    targetTime: Number,
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: Date
  }],
  reminders: [{
    type: Date
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  completedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update progress before saving
goalSchema.pre('save', function(next) {
  if (this.targetTime > 0) {
    this.progress = Math.min(100, Math.round((this.currentTime / this.targetTime) * 100));
  }
  
  // Update status based on progress and deadline
  if (this.progress >= 100) {
    this.status = 'completed';
    this.completedAt = new Date();
  } else if (this.deadline < new Date() && this.status === 'active') {
    this.status = 'failed';
  }
  
  this.updatedAt = new Date();
  next();
});

// Static method to calculate goal statistics
goalSchema.statics.getUserGoalStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalTargetTime: { $sum: '$targetTime' },
        totalCurrentTime: { $sum: '$currentTime' }
      }
    }
  ]);
  
  return stats;
};

// Method to add milestone
goalSchema.methods.addMilestone = function(milestoneData) {
  this.milestones.push({
    ...milestoneData,
    completed: false
  });
  return this.save();
};

// Method to update progress
goalSchema.methods.updateProgress = function(additionalTime) {
  this.currentTime += additionalTime;
  return this.save();
};

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;