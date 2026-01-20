import axios from 'axios'

// Use environment variable or default to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear local storage on 401
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      // Redirect to login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Auth APIs
export const register = (userData) => api.post('/auth/register', userData)
export const login = (credentials) => api.post('/auth/login', credentials)
export const getProfile = () => api.get('/auth/profile')
export const updateProfile = (profileData) => api.put('/auth/profile', profileData)

// Session APIs
export const createSession = (sessionData) => api.post('/sessions', sessionData)
export const getSessions = (params) => api.get('/sessions', { params })
export const getSessionStats = (params) => api.get('/sessions/stats', { params })

// Task APIs
export const getTasks = (params) => api.get('/tasks', { params })
export const getTaskStats = () => api.get('/tasks/stats')
export const createTask = (taskData) => api.post('/tasks', taskData)
export const updateTask = (id, taskData) => api.put(`/tasks/${id}`, taskData)
export const deleteTask = (id) => api.delete(`/tasks/${id}`)

// Goal APIs
export const getGoals = (params) => api.get('/goals', { params })
export const getGoalStats = () => api.get('/goals/stats')
export const createGoal = (goalData) => api.post('/goals', goalData)
export const updateGoal = (id, goalData) => api.put(`/goals/${id}`, goalData)
export const deleteGoal = (id) => api.delete(`/goals/${id}`)

// Health check
export const healthCheck = () => api.get('/health')

// Default export
export default {
  register,
  login,
  getProfile,
  updateProfile,
  createSession,
  getSessions,
  getSessionStats,
  getTasks,
  getTaskStats,
  createTask,
  updateTask,
  deleteTask,
  getGoals,
  getGoalStats,
  createGoal,
  updateGoal,
  deleteGoal,
  healthCheck,
}