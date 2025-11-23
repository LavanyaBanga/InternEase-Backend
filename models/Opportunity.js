// models/Opportunity.js
const mongoose = require('mongoose');

/**
 * Opportunity Schema
 * Defines the structure for events, internships, and courses.
 */
const opportunitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['event', 'internship', 'course'],
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  lastDate: {
    type: Date,
  },
  location: {
    type: String,
    default: 'Remote',
  },
  tags: [String],
  organizer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  applicants: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  }],
  views: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

const Opportunity = mongoose.model('Opportunity', opportunitySchema);
module.exports = Opportunity;