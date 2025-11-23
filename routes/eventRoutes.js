const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getOrganizerEvents,
  trackEventView
} = require('../controllers/eventController');
const { protect } = require('../middlewares/authMiddleware');

// Public routes
router.get('/', getEvents);

// Protected routes - IMPORTANT: Specific routes BEFORE parameterized routes
router.get('/organizer/my-events', protect, getOrganizerEvents);
router.post('/:id/register', protect, registerForEvent);
router.post('/:id/view', trackEventView); // Public - track views

// Parameterized routes (must come after specific routes)
router.get('/:id', getEventById);
router.post('/', protect, upload.single('poster'), createEvent);
router.put('/:id', protect, upload.single('poster'), updateEvent);
router.delete('/:id', protect, deleteEvent);

module.exports = router;
