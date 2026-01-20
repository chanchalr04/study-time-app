export const PRIORITIES = [
  { value: 'high', label: 'High', color: 'red' },
  { value: 'medium', label: 'Medium', color: 'yellow' },
  { value: 'low', label: 'Low', color: 'green' }
]

export const STATUSES = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' }
]

export const GOAL_CATEGORIES = [
  { value: 'study', label: 'Study' },
  { value: 'exercise', label: 'Exercise' },
  { value: 'health', label: 'Health' },
  { value: 'career', label: 'Career' },
  { value: 'personal', label: 'Personal' },
  { value: 'other', label: 'Other' }
]

export const SESSION_TYPES = [
  { value: 'pomodoro', label: 'Pomodoro' },
  { value: 'deep-work', label: 'Deep Work' },
  { value: 'break', label: 'Break' },
  { value: 'review', label: 'Review' },
  { value: 'other', label: 'Other' }
]

export const STUDY_SUBJECTS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'Programming',
  'English',
  'History',
  'Geography',
  'Economics',
  'Business',
  'Art',
  'Music',
  'Other'
]

export const DEFAULT_DAILY_GOAL = 120 // 2 hours in minutes
export const DEFAULT_WORK_DURATION = 25 // Pomodoro work duration
export const DEFAULT_BREAK_DURATION = 5 // Pomodoro break duration