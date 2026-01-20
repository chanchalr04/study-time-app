const express = require('express');
const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Tasks route working!' });
});

// Get all tasks
router.get('/', (req, res) => {
  res.json({ 
    message: 'Get all tasks endpoint',
    tasks: [
      { id: 1, title: 'Math homework', status: 'pending' },
      { id: 2, title: 'Physics project', status: 'completed' }
    ] 
  });
});

// Create task
router.post('/', (req, res) => {
  const taskData = req.body;
  res.status(201).json({
    message: 'Task created',
    task: {
      id: Date.now(),
      ...taskData,
      createdAt: new Date()
    }
  });
});

module.exports = router;