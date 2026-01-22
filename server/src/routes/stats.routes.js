const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getDashboardStats
} = require('../controllers/stats.controller');

router.use(auth);

router.get('/dashboard', getDashboardStats);

module.exports = router;