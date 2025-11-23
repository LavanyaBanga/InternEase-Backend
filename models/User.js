// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema
 * Defines the structure for users (both students and organizers).
 * A single model is used with a 'role' field to differentiate between them.
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false, // Do not return password by default
  },
  role: {
    type: String,
    enum: ['student', 'organizer'],
    default: 'student',
  },
  // Student-specific fields
  resumeLink: {
    type: String,
    default: '',
  },
  badges: [{
    type: String,
  }],
  // Organizer-specific fields
  organizationName: {
    type: String,
  },
  contactInfo: {
    type: String,
  },
}, {
  timestamps: true,
});

// Middleware to hash password before saving the user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  console.log('🔒 Hashing password before save...');
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  console.log('✅ Password hashed successfully');
  next();
});

// Method to compare entered password with the hashed password in the database
userSchema.methods.matchPassword = async function (enteredPassword) {
  console.log('🔍 Comparing passwords...');
  console.log('Entered password length:', enteredPassword?.length);
  console.log('Stored hash:', this.password?.substring(0, 20) + '...');
  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  console.log('Match result:', isMatch);
  return isMatch;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
