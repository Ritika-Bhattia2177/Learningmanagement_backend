require('dotenv').config();

const express = require('express');
const cors = require('cors');

const connectDB = require('./config/database');
const loggerMiddleware = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');

// Initialize app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

// Welcome Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Learning Management System API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      courses: '/api/courses',
      enrollments: '/api/enrollments',
    },
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handling middleware
app.use(errorHandler);

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

const startServer = async () => {
  const port = process.env.PORT || 5000;

  try {
    await connectDB();

    app.listen(port, () => {
      console.log('╔═══════════════════════════════════════╗');
      console.log('║  Learning Management System API      ║');
      console.log(`║  Server running on port ${port}`.padEnd(39) + '║');
      console.log(`║  Environment: ${process.env.NODE_ENV || 'development'}`.padEnd(39) + '║');
      console.log('╚═══════════════════════════════════════╝');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

// EXPORT APP FOR VERCEL
module.exports = app;