const StudySession = require('../models/StudySession');
const Task = require('../models/Task');
const Goal = require('../models/Goal');

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Get counts
    const totalTasks = await Task.countDocuments({ user: userId });
    const completedTasks = await Task.countDocuments({ 
      user: userId, 
      status: 'completed' 
    });
    
    const activeGoals = await Goal.countDocuments({ 
      user: userId, 
      status: 'active' 
    });
    
    const totalSessions = await StudySession.countDocuments({ user: userId });
    
    // Get today's sessions
    const todaysSessions = await StudySession.find({
      user: userId,
      startTime: { $gte: today, $lt: tomorrow }
    });
    
    const todaysDuration = todaysSessions.reduce((sum, session) => 
      sum + (session.duration || 0), 0
    );
    
    // Get this week's sessions (last 7 days)
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weeklySessions = await StudySession.find({
      user: userId,
      startTime: { $gte: weekAgo }
    });
    
    const weeklyDuration = weeklySessions.reduce((sum, session) => 
      sum + (session.duration || 0), 0
    );
    
    // Calculate average session duration
    const avgSessionDuration = totalSessions > 0 
      ? Math.round(weeklyDuration / weeklySessions.length) 
      : 0;
    
    res.status(200).json({
      success: true,
      stats: {
        tasks: {
          total: totalTasks,
          completed: completedTasks,
          pending: totalTasks - completedTasks
        },
        goals: {
          active: activeGoals
        },
        sessions: {
          total: totalSessions,
          today: todaysSessions.length,
          todayDuration: todaysDuration,
          weeklyDuration: weeklyDuration,
          avgDuration: avgSessionDuration
        },
        productivity: {
          taskCompletionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
          dailyAverage: Math.round(todaysDuration / 60) // Convert to hours
        }
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats
};