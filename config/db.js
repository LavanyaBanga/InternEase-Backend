// config/db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Establishes a connection to the MongoDB database using the URI from environment variables.
 */
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn('⚠️  MongoDB URI not provided. Running without database connection.');
      console.warn('⚠️  Database-dependent features will not work.');
      return;
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    console.warn('⚠️  Continuing without database. DB-dependent features will not work.');
    // Don't exit - allow server to run without DB
  }
};

module.exports = connectDB;