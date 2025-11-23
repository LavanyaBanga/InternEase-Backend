// models/Notification.js
const mongoose = require('mongoose');

/**
 * Notification Schema
 * Stores notifications for users.
 */
const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: false, // Can be null for broadcast notifications
  },
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  senderName: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['general', 'event', 'internship', 'application', 'broadcast'],
    default: 'general',
  },
  targetAudience: {
    type: String,
    enum: ['all', 'students', 'organizers', 'specific'],
    default: 'all',
  },
  read: {
    type: Boolean,
    default: false,
  },
  link: { // Optional link to navigate to
    type: String,
  }
}, {
  timestamps: true,
});

// Index for faster queries
notificationSchema.index({ user: 1, read: 1, createdAt: -1 });
notificationSchema.index({ targetAudience: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
