// models/EventbriteInteraction.js
const mongoose = require('mongoose');

const EventbriteInteractionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  eventbriteId: {
    type: String,
    required: true,
    index: true
  },
  eventTitle: {
    type: String,
    required: true
  },
  interactionType: {
    type: String,
    enum: ['view', 'register'],
    required: true
  },
  registeredAt: {
    type: Date,
    default: Date.now
  },
  metadata: {
    eventUrl: String,
    location: String,
    date: String
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate registrations
EventbriteInteractionSchema.index({ user: 1, eventbriteId: 1, interactionType: 1 }, { unique: true });

module.exports = mongoose.model('EventbriteInteraction', EventbriteInteractionSchema);
