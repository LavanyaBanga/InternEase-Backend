const express = require('express');
const router = express.Router();
const {
  getMyNotifications,
  createNotification,
  markAsRead,
  deleteNotification,
} = require('../controllers/notificationController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .get(protect, getMyNotifications)
  .post(protect, createNotification);

router.route('/:id/read').put(protect, markAsRead);
router.route('/:id').delete(protect, deleteNotification);

// Make sure this line is exactly like this
module.exports = router;