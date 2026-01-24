const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./src/config/database');

const app = express();

/* =========================
   CORS – UPDATED WORKING SETUP
========================= */
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://study-time-app-zeta.vercel.app'
];

// Vercel preview URL pattern
const vercelPreviewPattern = /^https:\/\/study-time-app-.*-[\w-]+\.vercel\.app$/;
const vercelUserPattern = /^https:\/\/study-time-app-[a-z0-9]+\.vercel\.app$/;

app.use(cors({
  origin: function (origin, callback) {
    // 1. Allow requests with no origin (Postman, curl, server-to-server)
    if (!origin) {
      console.log('CORS: No origin - allowing');
      return callback(null, true);
    }

    // 2. Check exact matches
    if (allowedOrigins.includes(origin)) {
      console.log('CORS: Exact match - allowing:', origin);
      return callback(null, true);
    }

    // 3. Check Vercel preview deployments
    if (vercelPreviewPattern.test(origin)) {
      console.log('CORS: Vercel preview - allowing:', origin);
      return callback(null, true);
    }

    // 4. Check Vercel user deployments
    if (vercelUserPattern.test(origin)) {
      console.log('CORS: Vercel user - allowing:', origin);
      return callback(null, true);
    }

    // 5. Simple check for any vercel.app domain with study-time-app
    if (origin.includes('.vercel.app') && origin.includes('study-time-app')) {
      console.log('CORS: Generic Vercel - allowing:', origin);
      return callback(null, true);
    }

    console.log('CORS: Blocking origin:', origin);
    callback(new Error(`CORS Error: Origin ${origin} not allowed`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Authorization', 'X-Total-Count'],
  credentials: true, // ✅ CHANGE TO TRUE
  maxAge: 86400 // Cache preflight for 24 hours
}));

// 🔥 CRITICAL: Handle preflight explicitly
app.options('*', (req, res) => {
  const origin = req.headers.origin;
  
  // Check if origin is allowed
  const isOriginAllowed = 
    !origin || 
    allowedOrigins.includes(origin) ||
    origin.includes('.vercel.app');
  
  if (isOriginAllowed && origin) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400');
  res.sendStatus(204);
});

/* =========================
   MIDDLEWARES
========================= */
app.use(helmet({
  crossOriginResourcePolicy: false, // ✅ Important for CORS
}));
app.use(express.json());
app.use(morgan('dev'));

// Add custom headers middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Set CORS headers dynamically
  if (origin && (
    allowedOrigins.includes(origin) || 
    origin.includes('.vercel.app')
  )) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  
  next();
});

/* =========================
   DATABASE
========================= */
connectDB();

/* =========================
   ROUTES
========================= */
app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/users', require('./src/routes/user.routes'));
app.use('/api/tasks', require('./src/routes/task.routes'));
app.use('/api/goals', require('./src/routes/goal.routes'));
app.use('/api/sessions', require('./src/routes/session.routes'));
app.use('/api/stats', require('./src/routes/stats.routes'));

/* =========================
   TEST ROUTES
========================= */
app.get('/', (req, res) => {
  // Set CORS headers for test route
  const origin = req.headers.origin;
  if (origin && origin.includes('vercel.app')) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  res.send('API is running 🚀');
});

app.get('/health', (req, res) => {
  // Set CORS headers for health check
  const origin = req.headers.origin;
  if (origin && origin.includes('vercel.app')) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  res.status(200).json({ 
    status: 'OK',
    cors: 'enabled',
    timestamp: new Date().toISOString()
  });
});

// CORS test endpoint
app.get('/api/cors-test', (req, res) => {
  res.json({
    message: 'CORS test successful',
    origin: req.headers.origin,
    timestamp: new Date().toISOString(),
    allowedOrigins: allowedOrigins
  });
});

// CORS error handler
app.use((err, req, res, next) => {
  if (err.message && err.message.includes('CORS')) {
    console.error('CORS Error:', err.message);
    
    // Still send CORS headers even on error
    const origin = req.headers.origin;
    if (origin && origin.includes('vercel.app')) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Credentials', 'true');
    }
    
    return res.status(403).json({
      error: 'CORS Error',
      message: err.message,
      allowedOrigins: allowedOrigins,
      yourOrigin: origin
    });
  }
  next(err);
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
  console.log(`✅ CORS enabled for:`, allowedOrigins);
  console.log(`✅ Also allowing all Vercel preview deployments`);
  console.log(`✅ Test endpoint: http://localhost:${PORT}/api/cors-test`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
});