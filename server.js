const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv');
const helmet = require('helmet');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const { errorHandler } = require('./middlewares/errorMiddleware');

// Load environment variables from .env file
dotenv.config();

// --- DATABASE CONNECTION ---
// Connect to the MongoDB database
connectDB();

const app = express();

// --- CORE MIDDLEWARES ---
// Set security-related HTTP headers
app.use(helmet());

// Configure CORS to allow requests from your frontend
// BEST PRACTICE: Place all core middleware before defining routes.
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"], // Support both frontend ports
  credentials: true
}));

// Body Parser Middleware to handle JSON and URL-encoded data
// This allows you to access `req.body` in your route handlers.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request logger middleware - log all incoming requests
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body).substring(0, 100));
  }
  next();
});

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));


// --- API ROUTES ---
// All your application's routes should be defined here.
app.get("/", (req, res) => {
  res.send("InternEase Backend is running!");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: dbStatus,
    environment: process.env.NODE_ENV || 'development'
  });
});

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


// --- ERROR HANDLING MIDDLEWARE ---
// CRITICAL: This must be the LAST middleware loaded.
// It catches any errors that occur in the routes above.
app.use(errorHandler);


// --- SERVER INITIALIZATION ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});