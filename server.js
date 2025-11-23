const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv');
const helmet = require('helmet');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const { errorHandler } = require('./middlewares/errorMiddleware');

dotenv.config();

connectDB();

const app = express();

app.use(helmet());

// CORS configuration for frontend
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_URL // Add your Vercel frontend URL in environment variables
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.some(allowed => origin.includes(allowed))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  console.log(📨 ${req.method} ${req.path});
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body).substring(0, 100));
  }
  next();
});

app.use('/uploads', express.static('uploads'));


app.get("/", (req, res) => {
  res.send("InternEase Backend is running!");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from the backend!" });
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


app.use(errorHandler);


const PORT = process.env.PORT || 5000;


if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT});
  });
}

// Export for Vercel
module.exports = app;