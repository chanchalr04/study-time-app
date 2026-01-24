const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./src/config/database');

const app = express();

/* =========================
   CORS – FINAL WORKING SETUP
========================= */
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://study-time-app-zeta.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (Postman, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));

// 🔥 VERY IMPORTANT – PRE-FLIGHT
app.options('*', cors());

/* =========================
   MIDDLEWARES
========================= */
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

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
  res.send('API is running 🚀');
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
