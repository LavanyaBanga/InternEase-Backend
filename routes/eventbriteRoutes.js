// routes/eventbriteRoutes.js
const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  trackView,
  trackRegistration,
  getStats,
  getEventStats,
  getMyRegistrations,
  getAllRegistrations,
  getStudentActivity
} = require('../controllers/eventbriteController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Public routes
router.route('/events').get(getEvents);
router.route('/events/:eventId').get(getEventById);

// Protected routes - any authenticated user can view/register
router.route('/events/:eventId/view').post(protect, trackView);
router.route('/events/:eventId/register').post(protect, trackRegistration);

// Student routes
router.route('/my-registrations').get(protect, getMyRegistrations);

// Organizer routes - stats
router.route('/stats').get(protect, authorize('organizer'), getStats);
router.route('/stats/:eventId').get(protect, authorize('organizer'), getEventStats);

// Admin/Organizer routes - view all student registrations
router.route('/admin/registrations').get(protect, authorize('organizer'), getAllRegistrations);
router.route('/admin/student/:studentId').get(protect, authorize('organizer'), getStudentActivity);

module.exports = router;
