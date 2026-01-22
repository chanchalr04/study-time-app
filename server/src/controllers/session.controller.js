const StudySession = require('../models/StudySession');
const User = require('../models/User');

const startSession = async (req, res) => {
  try {
    const sessionData = {
      ...req.body,
      user: req.user._id,
      status: 'in-progress',
      startTime: new Date()
    };
    
    const session = await StudySession.create(sessionData);
    
    res.status(201).json({
      success: true,
      message: 'Study session started',
      session
    });
  } catch (error) {
    console.error('Start session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

const getSessions = async (req, res) => {
  try {
    const { status } = req.query;
    const query = { user: req.user._id };
    
    if (status) query.status = status;
    
    const sessions = await StudySession.find(query)
      .populate('task', 'title')
      .populate('goal', 'title')
      .sort({ startTime: -1 });
    
    res.status(200).json({
      success: true,
      count: sessions.length,
      sessions
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

const getSession = async (req, res) => {
  try {
    const session = await StudySession.findOne({
      _id: req.params.id,
      user: req.user._id
    })
    .populate('task', 'title description')
    .populate('goal', 'title description');
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }
    
    res.status(200).json({
      success: true,
      session
    });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

const endSession = async (req, res) => {
  try {
    const { notes } = req.body;
    
    const session = await StudySession.findOne({
      _id: req.params.id,
      user: req.user._id,
      status: 'in-progress'
    });
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Active session not found'
      });
    }
    
    session.endTime = new Date();
    session.status = 'completed';
    if (notes) session.notes = notes;
    
    await session.save();
    
    // Update user streak
    const user = await User.findById(req.user._id);
    user.updateStreak();
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Study session ended',
      session
    });
  } catch (error) {
    console.error('End session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

const deleteSession = async (req, res) => {
  try {
    const session = await StudySession.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Session deleted successfully'
    });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  startSession,
  getSessions,
  getSession,
  endSession,
  deleteSession
};