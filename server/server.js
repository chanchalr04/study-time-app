const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./src/config/database');
// ... (keep all your route imports)

const app = express();

// 1. CORS MUST COME FIRST
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://study-time-app-zeta.vercel.app' // Your frontend
  ],
  credentials: true
}));

// 2. Then add other security/parsing middleware
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

// Connect to DB and set up routes...
connectDB();
app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/users', require('./src/routes/user.routes'));
app.use('/api/tasks', require('./src/routes/task.routes'));
app.use('/api/goals', require('./src/routes/goal.routes'));
app.use('/api/sessions', require('./src/routes/session.routes'));
app.use('/api/stats', require('./src/routes/stats.routes'));

//Test
app.get('/', (req, res) => {
  res.send('API is running 🚀');
});


// Health check and other routes...
app.get('/health', (req, res) => res.status(200).json({ status: 'OK' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});