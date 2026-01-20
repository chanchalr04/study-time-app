const express = require('express');
const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Sessions route working!' });
});

// Get all sessions
router.get('/', (req, res) => {
  res.json({ 
    message: 'Get all sessions endpoint',
    sessions: [] 
  });
});

// Create session
router.post('/', (req, res) => {
  const sessionData = req.body;
  res.status(201).json({
    message: 'Session created',
    session: {
      id: Date.now(),
      ...sessionData,
      createdAt: new Date()
    }
  });
});

module.exports = router;