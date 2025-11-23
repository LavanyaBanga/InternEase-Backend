// models/Note.js
const mongoose = require('mongoose');

/**
 * Note Schema
 * Stores notes created by students
 */
const noteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Please provide content'],
  },
  tags: [{
    type: String,
    trim: true,
  }],
  isPinned: {
    type: Boolean,
    default: false,
  },
  color: {
    type: String,
    default: '#ffffff',
  },
}, {
  timestamps: true,
});

// Index for searching
noteSchema.index({ user: 1, title: 'text', content: 'text', tags: 'text' });

const Note = mongoose.model('Note', noteSchema);
module.exports = Note;
