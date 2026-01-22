const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Database connection
const connectDB = require('./src/config/database');

// Import routes
const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const taskRoutes = require('./src/routes/task.routes');
const goalRoutes = require('./src/routes/goal.routes');
const sessionRoutes = require('./src/routes/session.routes');
const statsRoutes = require('./src/routes/stats.routes');

// Import middleware
const errorHandler = require('./src/middleware/error');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], // React/Vite dev servers
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/stats', statsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'OK',
    message: 'Study Planner API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: 'MongoDB'
  });
});

// Welcome route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: ' Study Planner API',
    version: '1.0.0',
    documentation: {
      endpoints: {
        auth: {
          'POST /api/auth/register': 'Register new user',
          'POST /api/auth/login': 'Login user',
          'GET /api/auth/me': 'Get current user profile',
          'POST /api/auth/logout': 'Logout user'
        },
        users: {
          'GET /api/users/profile': 'Get user profile',
          'PUT /api/users/profile': 'Update profile',
          'PUT /api/users/change-password': 'Change password'
        },
        tasks: {
          'POST /api/tasks': 'Create task',
          'GET /api/tasks': 'Get all tasks',
          'GET /api/tasks/:id': 'Get single task',
          'PUT /api/tasks/:id': 'Update task',
          'DELETE /api/tasks/:id': 'Delete task',
          'PUT /api/tasks/:id/complete': 'Mark task complete'
        },
        goals: {
          'POST /api/goals': 'Create goal',
          'GET /api/goals': 'Get all goals',
          'GET /api/goals/:id': 'Get single goal',
          'PUT /api/goals/:id': 'Update goal',
          'DELETE /api/goals/:id': 'Delete goal',
          'PUT /api/goals/:id/progress': 'Update goal progress'
        },
        sessions: {
          'POST /api/sessions': 'Start study session',
          'GET /api/sessions': 'Get all sessions',
          'GET /api/sessions/:id': 'Get single session',
          'PUT /api/sessions/:id': 'Update session',
          'DELETE /api/sessions/:id': 'Delete session',
          'POST /api/sessions/:id/end': 'End study session'
        },
        stats: {
          'GET /api/stats/dashboard': 'Get dashboard statistics',
          'GET /api/stats/productivity': 'Get productivity trends'
        }
      }
    }
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(
    ` Server started | Port: ${PORT} | Env: ${
      process.env.NODE_ENV || "development"
    }`
  );
  
});