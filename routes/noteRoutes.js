// routes/noteRoutes.js
const express = require('express');
const router = express.Router();
const {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  togglePinNote
} = require('../controllers/noteController');
const { protect } = require('../middlewares/authMiddleware');

// All routes require authentication (both students and organizers can use notes)
router.use(protect);

router.route('/')
  .get(getNotes)
  .post(createNote);

router.route('/:id')
  .get(getNoteById)
  .put(updateNote)
  .delete(deleteNote);

router.route('/:id/pin')
  .patch(togglePinNote);

module.exports = router;
