const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add event title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add event description']
  },
  type: {
    type: String,
    required: true,
    enum: ['Conference', 'Workshop', 'Hackathon', 'Competition', 'Webinar', 'TechFest']
  },
  date: {
    type: String,
    required: [true, 'Please add event date']
  },
  time: {
    type: String,
    required: [true, 'Please add event time']
  },
  deadline: {
    type: String,
    required: [true, 'Please add registration deadline']
  },
  location: {
    type: String,
    required: [true, 'Please add location']
  },
  maxParticipants: {
    type: Number,
    required: [true, 'Please add maximum participants']
  },
  currentParticipants: {
    type: Number,
    default: 0
  },
  registrationFee: {
    type: String,
    default: 'Free'
  },
  requirements: [{
    type: String
  }],
  poster: {
    type: String,
    default: null
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  organizerName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Live', 'Upcoming', 'Expired'],
    default: 'Live'
  },
  views: {
    type: Number,
    default: 0
  },
  registrations: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    registeredAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for faster queries
EventSchema.index({ type: 1, status: 1, date: 1 });
EventSchema.index({ organizer: 1 });

module.exports = mongoose.model('Event', EventSchema);
