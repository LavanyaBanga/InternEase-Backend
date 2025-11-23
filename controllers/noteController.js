// controllers/noteController.js
const asyncHandler = require('express-async-handler');
const Note = require('../models/Note');

// @desc    Get all notes for logged-in user
// @route   GET /api/notes
// @access  Private/Student
const getNotes = asyncHandler(async (req, res) => {
  console.log('=== GET NOTES ===');
  console.log('User ID:', req.user.id);

  const notes = await Note.find({ user: req.user.id }).sort('-updatedAt');
  
  console.log(`Found ${notes.length} notes`);
  
  res.status(200).json({
    success: true,
    count: notes.length,
    data: notes
  });
});

// @desc    Get single note
// @route   GET /api/notes/:id
// @access  Private/Student
const getNoteById = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }

  // Check if note belongs to user
  if (note.user.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to access this note');
  }

  res.status(200).json({
    success: true,
    data: note
  });
});

// @desc    Create new note
// @route   POST /api/notes
// @access  Private/Student
const createNote = asyncHandler(async (req, res) => {
  console.log('=== CREATE NOTE ===');
  console.log('User ID:', req.user.id);
  console.log('Body:', req.body);

  // Add user to req.body
  req.body.user = req.user.id;

  const note = await Note.create(req.body);
  
  console.log('Note created:', note._id);

  res.status(201).json({
    success: true,
    data: note
  });
});

// @desc    Update note
// @route   PUT /api/notes/:id
// @access  Private/Student
const updateNote = asyncHandler(async (req, res) => {
  console.log('=== UPDATE NOTE ===');
  console.log('Note ID:', req.params.id);
  console.log('User ID:', req.user.id);
  console.log('Body:', req.body);

  let note = await Note.findById(req.params.id);

  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }

  // Check if note belongs to user
  if (note.user.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to update this note');
  }

  note = await Note.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  console.log('Note updated:', note._id);

  res.status(200).json({
    success: true,
    data: note
  });
});

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Private/Student
const deleteNote = asyncHandler(async (req, res) => {
  console.log('=== DELETE NOTE ===');
  console.log('Note ID:', req.params.id);
  console.log('User ID:', req.user.id);

  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }

  // Check if note belongs to user
  if (note.user.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to delete this note');
  }

  await note.deleteOne();

  console.log('Note deleted');

  res.status(200).json({
    success: true,
    message: 'Note deleted successfully'
  });
});

// @desc    Toggle pin status
// @route   PATCH /api/notes/:id/pin
// @access  Private/Student
const togglePinNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }

  // Check if note belongs to user
  if (note.user.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to modify this note');
  }

  note.isPinned = !note.isPinned;
  await note.save();

  res.status(200).json({
    success: true,
    data: note
  });
});

module.exports = {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  togglePinNote
};
