const moment = require('moment');

// Pagination helper
const getPagination = (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return { skip, limit };
};

// Sort helper
const getSort = (sortString = 'createdAt:desc') => {
  const [field, order] = sortString.split(':');
  return { [field]: order === 'asc' ? 1 : -1 };
};

// Filter helper for tasks
const getTaskFilters = (query, userId) => {
  const filters = { user: userId };
  
  if (query.status) {
    filters.status = query.status;
  }
  
  if (query.priority) {
    filters.priority = query.priority;
  }
  
  if (query.subject) {
    filters.subject = query.subject;
  }
  
  if (query.tags) {
    filters.tags = { $in: query.tags.split(',') };
  }
  
  if (query.dueDateFrom) {
    filters.dueDate = filters.dueDate || {};
    filters.dueDate.$gte = new Date(query.dueDateFrom);
  }
  
  if (query.dueDateTo) {
    filters.dueDate = filters.dueDate || {};
    filters.dueDate.$lte = new Date(query.dueDateTo);
  }
  
  if (query.search) {
    filters.$or = [
      { title: { $regex: query.search, $options: 'i' } },
      { description: { $regex: query.search, $options: 'i' } }
    ];
  }
  
  return filters;
};

// Filter helper for sessions
const getSessionFilters = (query, userId) => {
  const filters = { user: userId };
  
  if (query.subject) {
    filters.subject = query.subject;
  }
  
  if (query.status) {
    filters.status = query.status;
  }
  
  if (query.startDate && query.endDate) {
    filters.startTime = {
      $gte: new Date(query.startDate),
      $lte: new Date(query.endDate)
    };
  }
  
  if (query.minDuration) {
    filters.duration = filters.duration || {};
    filters.duration.$gte = parseInt(query.minDuration);
  }
  
  if (query.maxDuration) {
    filters.duration = filters.duration || {};
    filters.duration.$lte = parseInt(query.maxDuration);
  }
  
  return filters;
};

// Calculate statistics
const calculateProductivityStats = (sessions) => {
  const stats = {
    totalSessions: sessions.length,
    totalDuration: 0,
    averageDuration: 0,
    averageProductivity: 0,
    averageMoodBefore: 0,
    averageMoodAfter: 0,
    totalDistractions: 0,
    totalBreaks: 0,
    efficiency: 0
  };
  
  if (sessions.length === 0) return stats;
  
  sessions.forEach(session => {
    stats.totalDuration += session.duration || 0;
    stats.totalDistractions += session.distractions?.length || 0;
    stats.totalBreaks += session.breaks?.length || 0;
    
    if (session.productivityScore) {
      stats.averageProductivity += session.productivityScore;
    }
    
    if (session.moodBefore) {
      stats.averageMoodBefore += session.moodBefore;
    }
    
    if (session.moodAfter) {
      stats.averageMoodAfter += session.moodAfter;
    }
  });
  
  stats.averageDuration = Math.round(stats.totalDuration / sessions.length);
  stats.averageProductivity = parseFloat((stats.averageProductivity / sessions.length).toFixed(1));
  stats.averageMoodBefore = parseFloat((stats.averageMoodBefore / sessions.length).toFixed(1));
  stats.averageMoodAfter = parseFloat((stats.averageMoodAfter / sessions.length).toFixed(1));
  
  // Calculate efficiency (focus time / total time)
  const totalFocusTime = sessions.reduce((sum, session) => {
    let distractionTime = 0;
    session.distractions?.forEach(d => distractionTime += d.duration || 0);
    
    let breakTime = 0;
    session.breaks?.forEach(b => breakTime += b.duration || 0);
    
    const focusTime = (session.duration || 0) - distractionTime - breakTime;
    return sum + Math.max(0, focusTime);
  }, 0);
  
  stats.efficiency = stats.totalDuration > 0 
    ? parseFloat(((totalFocusTime / stats.totalDuration) * 100).toFixed(1))
    : 0;
  
  return stats;
};

// Format date for display
const formatDate = (date, format = 'DD/MM/YYYY HH:mm') => {
  return moment(date).format(format);
};

// Calculate study streak
const calculateStreak = (sessions) => {
  if (sessions.length === 0) return 0;
  
  const dates = sessions
    .map(s => moment(s.startTime).format('YYYY-MM-DD'))
    .filter((date, index, self) => self.indexOf(date) === index)
    .sort()
    .reverse();
  
  let streak = 0;
  let currentDate = moment();
  
  for (let date of dates) {
    const sessionDate = moment(date);
    const diffDays = currentDate.diff(sessionDate, 'days');
    
    if (diffDays === streak) {
      streak++;
    } else {
      break;
    }
    
    currentDate = sessionDate;
  }
  
  return streak;
};

// Generate time slots for scheduling
const generateTimeSlots = (startTime = '09:00', endTime = '18:00', interval = 30) => {
  const slots = [];
  let current = moment(startTime, 'HH:mm');
  const end = moment(endTime, 'HH:mm');
  
  while (current <= end) {
    slots.push({
      time: current.format('HH:mm'),
      display: current.format('h:mm A'),
      available: true
    });
    current.add(interval, 'minutes');
  }
  
  return slots;
};

module.exports = {
  getPagination,
  getSort,
  getTaskFilters,
  getSessionFilters,
  calculateProductivityStats,
  formatDate,
  calculateStreak,
  generateTimeSlots
};