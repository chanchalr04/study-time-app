const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');
const auth = require('../middleware/auth');

// @route   GET /api/goals/test
// @desc    Test goals route
// @access  Public
router.get('/test', (req, res) => {
  res.json({ message: 'Goals route working!' });
});

// @route   GET /api/goals
// @desc    Get all goals for authenticated user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { status, category, priority, sortBy = 'deadline', sortOrder = 'asc' } = req.query;
    
    // Build filter object
    const filter = { user: req.userId };
    
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const goals = await Goal.find(filter)
      .sort(sort)
      .populate('user', 'username email');
    
    res.json({
      success: true,
      count: goals.length,
      goals
    });
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   GET /api/goals/stats
// @desc    Get goal statistics for user
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const stats = await Goal.getUserGoalStats(req.userId);
    
    // Calculate overall statistics
    const totalGoals = await Goal.countDocuments({ user: req.userId });
    const activeGoals = await Goal.countDocuments({ 
      user: req.userId, 
      status: 'active' 
    });
    const completedGoals = await Goal.countDocuments({ 
      user: req.userId, 
      status: 'completed' 
    });
    
    // Calculate average progress
    const goals = await Goal.find({ user: req.userId });
    const avgProgress = goals.length > 0 
      ? goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length 
      : 0;
    
    res.json({
      success: true,
      stats: {
        totalGoals,
        activeGoals,
        completedGoals,
        averageProgress: avgProgress.toFixed(2),
        detailedStats: stats
      }
    });
  } catch (error) {
    console.error('Get goal stats error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   GET /api/goals/:id
// @desc    Get single goal by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const goal = await Goal.findOne({ 
      _id: req.params.id, 
      user: req.userId 
    }).populate('user', 'username email');
    
    if (!goal) {
      return res.status(404).json({ 
        success: false,
        message: 'Goal not found' 
      });
    }
    
    res.json({
      success: true,
      goal
    });
  } catch (error) {
    console.error('Get goal error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   POST /api/goals
// @desc    Create a new goal
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      targetTime,
      deadline,
      priority,
      milestones,
      tags,
      isPublic
    } = req.body;
    
    // Validation
    if (!title || !targetTime || !deadline) {
      return res.status(400).json({ 
        success: false,
        message: 'Title, target time, and deadline are required' 
      });
    }
    
    // Check if deadline is in the future
    if (new Date(deadline) <= new Date()) {
      return res.status(400).json({ 
        success: false,
        message: 'Deadline must be in the future' 
      });
    }
    
    // Create goal
    const goal = new Goal({
      user: req.userId,
      title,
      description,
      category,
      targetTime,
      deadline,
      priority,
      milestones: milestones || [],
      tags: tags || [],
      isPublic: isPublic || false
    });
    
    await goal.save();
    
    res.status(201).json({
      success: true,
      message: 'Goal created successfully',
      goal
    });
  } catch (error) {
    console.error('Create goal error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   PUT /api/goals/:id
// @desc    Update a goal
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      targetTime,
      currentTime,
      deadline,
      status,
      priority,
      tags,
      isPublic
    } = req.body;
    
    // Find goal
    let goal = await Goal.findOne({ 
      _id: req.params.id, 
      user: req.userId 
    });
    
    if (!goal) {
      return res.status(404).json({ 
        success: false,
        message: 'Goal not found' 
      });
    }
    
    // Update fields
    if (title !== undefined) goal.title = title;
    if (description !== undefined) goal.description = description;
    if (category !== undefined) goal.category = category;
    if (targetTime !== undefined) goal.targetTime = targetTime;
    if (currentTime !== undefined) goal.currentTime = currentTime;
    if (deadline !== undefined) goal.deadline = deadline;
    if (status !== undefined) goal.status = status;
    if (priority !== undefined) goal.priority = priority;
    if (tags !== undefined) goal.tags = tags;
    if (isPublic !== undefined) goal.isPublic = isPublic;
    
    await goal.save();
    
    res.json({
      success: true,
      message: 'Goal updated successfully',
      goal
    });
  } catch (error) {
    console.error('Update goal error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   PATCH /api/goals/:id/progress
// @desc    Update goal progress by adding time
// @access  Private
router.patch('/:id/progress', auth, async (req, res) => {
  try {
    const { additionalTime } = req.body;
    
    if (!additionalTime || additionalTime <= 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Valid additional time is required' 
      });
    }
    
    const goal = await Goal.findOne({ 
      _id: req.params.id, 
      user: req.userId 
    });
    
    if (!goal) {
      return res.status(404).json({ 
        success: false,
        message: 'Goal not found' 
      });
    }
    
    if (goal.status !== 'active') {
      return res.status(400).json({ 
        success: false,
        message: 'Cannot update progress for non-active goal' 
      });
    }
    
    await goal.updateProgress(additionalTime);
    
    res.json({
      success: true,
      message: 'Progress updated successfully',
      goal
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   POST /api/goals/:id/milestones
// @desc    Add milestone to goal
// @access  Private
router.post('/:id/milestones', auth, async (req, res) => {
  try {
    const { title, description, targetTime } = req.body;
    
    if (!title || !targetTime) {
      return res.status(400).json({ 
        success: false,
        message: 'Title and target time are required for milestone' 
      });
    }
    
    const goal = await Goal.findOne({ 
      _id: req.params.id, 
      user: req.userId 
    });
    
    if (!goal) {
      return res.status(404).json({ 
        success: false,
        message: 'Goal not found' 
      });
    }
    
    await goal.addMilestone({ title, description, targetTime });
    
    res.json({
      success: true,
      message: 'Milestone added successfully',
      goal
    });
  } catch (error) {
    console.error('Add milestone error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   PATCH /api/goals/:id/milestones/:milestoneId
// @desc    Update milestone completion status
// @access  Private
router.patch('/:id/milestones/:milestoneId', auth, async (req, res) => {
  try {
    const { completed } = req.body;
    const { id, milestoneId } = req.params;
    
    const goal = await Goal.findOne({ 
      _id: id, 
      user: req.userId 
    });
    
    if (!goal) {
      return res.status(404).json({ 
        success: false,
        message: 'Goal not found' 
      });
    }
    
    const milestone = goal.milestones.id(milestoneId);
    if (!milestone) {
      return res.status(404).json({ 
        success: false,
        message: 'Milestone not found' 
      });
    }
    
    milestone.completed = completed !== undefined ? completed : !milestone.completed;
    milestone.completedAt = milestone.completed ? new Date() : null;
    
    await goal.save();
    
    res.json({
      success: true,
      message: `Milestone ${milestone.completed ? 'completed' : 'marked as incomplete'}`,
      milestone
    });
  } catch (error) {
    console.error('Update milestone error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   DELETE /api/goals/:id
// @desc    Delete a goal
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.userId 
    });
    
    if (!goal) {
      return res.status(404).json({ 
        success: false,
        message: 'Goal not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Goal deleted successfully'
    });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   GET /api/goals/upcoming/deadlines
// @desc    Get goals with upcoming deadlines
// @access  Private
router.get('/upcoming/deadlines', auth, async (req, res) => {
  try {
    const { days = 7 } = req.query;
    
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + parseInt(days));
    
    const upcomingGoals = await Goal.find({
      user: req.userId,
      status: 'active',
      deadline: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort('deadline');
    
    res.json({
      success: true,
      count: upcomingGoals.length,
      goals: upcomingGoals
    });
  } catch (error) {
    console.error('Get upcoming deadlines error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
});

module.exports = router;