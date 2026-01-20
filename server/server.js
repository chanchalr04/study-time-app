const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost:27017/studytime'
)
.then(() => console.log(' MongoDB connected successfully'))
.catch(err => console.log(' MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/auth');
const sessionRoutes = require('./routes/sessions');
const taskRoutes = require('./routes/tasks');

app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/tasks', taskRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Study Time App Backend',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      sessions: '/api/sessions',
      tasks: '/api/tasks'
    }
  });
});

// ✅ 404 handler (FIXED)
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
