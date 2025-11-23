// controllers/notificationController.js
const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Get notifications for logged-in user
// @route   GET /api/notifications
// @access  Private
const getMyNotifications = asyncHandler(async (req, res) => {
  console.log('=== GET NOTIFICATIONS ===');
  console.log('User ID:', req.user.id);
  console.log('User Role:', req.user.role);

  // Get notifications for specific user OR broadcast to their role
  const notifications = await Notification.find({
    $or: [
      { user: req.user.id },
      { targetAudience: 'all' },
      { targetAudience: req.user.role === 'student' ? 'students' : 'organizers' }
    ]
  }).sort({ createdAt: -1 });

  console.log('Found notifications:', notifications.length);

  res.status(200).json({ 
    success: true, 
    count: notifications.length, 
    data: notifications 
  });
});

// @desc    Create notification (broadcast)
// @route   POST /api/notifications
// @access  Private (Organizer only)
const createNotification = asyncHandler(async (req, res) => {
  console.log('=== CREATE NOTIFICATION ===');
  console.log('Sender:', req.user.id, req.user.name);
  console.log('Body:', req.body);

  const { title, message, type, targetAudience, link } = req.body;

  if (!title || !message) {
    res.status(400);
    throw new Error('Please provide title and message');
  }

  // If targeting specific students, create individual notifications
  // If broadcast, create one notification with targetAudience
  if (targetAudience === 'all' || targetAudience === 'students' || targetAudience === 'organizers') {
    // Create broadcast notification
    const notification = await Notification.create({
      sender: req.user.id,
      senderName: req.user.name,
      title,
      message,
      type: type || 'general',
      targetAudience,
      link: link || null,
    });

    console.log('Broadcast notification created:', notification);

    res.status(201).json({
      success: true,
      data: notification,
      message: 'Notification sent successfully'
    });
  } else {
    // For specific user notifications (future enhancement)
    res.status(400);
    throw new Error('Specific user targeting not implemented yet');
  }
});

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  // Allow if user owns it or if it's a broadcast to their role
  const canRead = notification.user?.toString() === req.user.id || 
                  notification.targetAudience === 'all' ||
                  (notification.targetAudience === 'students' && req.user.role === 'student') ||
                  (notification.targetAudience === 'organizers' && req.user.role === 'organizer');

  if (!canRead) {
    res.status(401);
    throw new Error('Not authorized');
  }

  notification.read = true;
  await notification.save();

  res.status(200).json({ success: true, data: notification });
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  // Only sender can delete
  if (notification.sender.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized to delete this notification');
  }

  await notification.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Notification deleted'
  });
});

module.exports = {
  getMyNotifications,
  createNotification,
  markAsRead,
  deleteNotification
};
