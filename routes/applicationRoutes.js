const express = require('express');
const router = express.Router();
const {
  applyToOpportunity,
  getMyApplications,
  getOrganizerApplications,
  getApplications,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.route('/apply/:opportunityId').post(protect, authorize('student'), applyToOpportunity);
router.route('/me').get(protect, authorize('student'), getMyApplications);
router.route('/organizer').get(protect, authorize('organizer'), getOrganizerApplications);
router.route('/').get(protect, getApplications); // Get applications with filters
router.route('/:id/status').put(protect, authorize('organizer'), updateApplicationStatus);

// Make sure this line is exactly like this
module.exports = router;