const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const {
  getOpportunities,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  getOpportunityById,
  getOrganizerOpportunities,
  applyForOpportunity,
  trackOpportunityView
} = require('../controllers/opportunityController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Public routes
router.get('/', getOpportunities);

// Protected routes - IMPORTANT: Specific routes BEFORE parameterized routes
router.get('/organizer/my-opportunities', protect, authorize('organizer'), getOrganizerOpportunities);
router.post('/:id/apply', protect, authorize('student'), applyForOpportunity);
router.post('/:id/view', trackOpportunityView); // Public - track views

// Parameterized routes (must come after specific routes)
router.get('/:id', getOpportunityById);
router.post('/', protect, authorize('organizer'), createOpportunity);
router.put('/:id', protect, authorize('organizer'), updateOpportunity);
router.delete('/:id', protect, authorize('organizer'), deleteOpportunity);

// Make sure this line is exactly like this
module.exports = router;