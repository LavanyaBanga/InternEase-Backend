const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { errorHandler } = require('./middlewares/errorMiddleware');

// Load environment variables first
dotenv.config();

const app = express();

// Connect to database (non-blocking for serverless)
const connectDB = require('./config/db');
connectDB().catch(err => console.log('DB connection failed:', err.message));

// Disable helmet for serverless (can cause issues)
// app.use(helmet());

// CORS configuration - Allow all origins for Vercel deployment
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simplified logging for serverless
app.use((req, res, next) => {
  console.log(${req.method} ${req.path});
  next();
});

// Static files (might not work in serverless)
// app.use('/uploads', express.static('uploads'));


app.get("/", (req, res) => {
  res.json({ 
    message: "InternEase Backend API is running!",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      opportunities: "/api/opportunities",
      applications: "/api/applications",
      events: "/api/events",
      eventbrite: "/api/eventbrite",
      githubInternships: "/api/github-internships",
      githubCourses: "/api/github-courses",
      notifications: "/api/notifications",
      notes: "/api/notes"
    }
  });
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from the backend!", timestamp: new Date().toISOString() });
});

app.get("/api/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: dbStatus,
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes with error handling
try {
  app.use('/api/auth', require('./routes/authRoutes'));
  app.use('/api/opportunities', require('./routes/opportunityRoutes'));
  app.use('/api/applications', require('./routes/applicationRoutes'));
  app.use('/api/notifications', require('./routes/notificationRoutes'));
  app.use('/api/events', require('./routes/eventRoutes'));
  app.use('/api/eventbrite', require('./routes/eventbriteRoutes'));
  app.use('/api/github-internships', require('./routes/githubInternshipsRoutes'));
  app.use('/api/github-courses', require('./routes/githubCoursesRoutes'));
  app.use('/api/notes', require('./routes/noteRoutes'));
  app.use('/api/upload', require('./routes/uploadRoutes'));
} catch (error) {
  console.error('Error loading routes:', error.message);
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: Route ${req.url} not found 
  });
});

// Error handler (must be last)
app.use(errorHandler);


const PORT = process.env.PORT || 5000;

// Start server only in development (not on Vercel)
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT});
  });
}

// Export for Vercel serverless
module.exports = app;