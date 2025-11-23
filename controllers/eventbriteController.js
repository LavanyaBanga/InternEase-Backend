// controllers/eventbriteController.js
const asyncHandler = require('express-async-handler');
const { 
  getEventbriteEvents, 
  getEventbriteEventById,
  getEventbriteAttendees 
} = require('../services/eventbriteService');
const EventbriteInteraction = require('../models/EventbriteInteraction');

// @desc    Get all Eventbrite events
// @route   GET /api/eventbrite/events
// @access  Public
exports.getEvents = asyncHandler(async (req, res) => {
  try {
    console.log('=== GET EVENTBRITE EVENTS ===');
    
    const options = {
      status: req.query.status || 'live',
      order_by: req.query.order_by || 'start_desc',
      page_size: req.query.page_size || 50
    };

    const events = await getEventbriteEvents(options);
    
    console.log('Returning', events.length, 'Eventbrite events');
    
    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Get Eventbrite events error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch Eventbrite events'
    });
  }
});

// @desc    Get single Eventbrite event
// @route   GET /api/eventbrite/events/:eventId
// @access  Public
exports.getEventById = asyncHandler(async (req, res) => {
  try {
    const event = await getEventbriteEventById(req.params.eventId);
    
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Get Eventbrite event error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch Eventbrite event'
    });
  }
});

// @desc    Track event view
// @route   POST /api/eventbrite/events/:eventId/view
// @access  Private
exports.trackView = asyncHandler(async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    console.log('=== TRACK EVENTBRITE VIEW ===');
    console.log('User:', userId);
    console.log('Event:', eventId);

    // Check if already viewed
    const existingView = await EventbriteInteraction.findOne({
      user: userId,
      eventbriteId: eventId,
      interactionType: 'view'
    });

    if (existingView) {
      return res.status(200).json({
        success: true,
        message: 'View already tracked',
        data: existingView
      });
    }

    // Get event details
    const event = await getEventbriteEventById(eventId);

    // Create view interaction
    const interaction = await EventbriteInteraction.create({
      user: userId,
      eventbriteId: eventId,
      eventTitle: event.title,
      interactionType: 'view',
      metadata: {
        eventUrl: event.url,
        location: event.location,
        date: event.date
      }
    });

    console.log('View tracked successfully');

    res.status(201).json({
      success: true,
      data: interaction
    });
  } catch (error) {
    // If duplicate key error (race condition), return success
    if (error.code === 11000) {
      return res.status(200).json({
        success: true,
        message: 'View already tracked'
      });
    }
    
    console.error('Track view error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to track view'
    });
  }
});

// @desc    Track event registration
// @route   POST /api/eventbrite/events/:eventId/register
// @access  Private/Student
exports.trackRegistration = asyncHandler(async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    console.log('=== TRACK EVENTBRITE REGISTRATION ===');
    console.log('User:', userId, req.user.name);
    console.log('Event:', eventId);

    // Check if already registered
    const existingRegistration = await EventbriteInteraction.findOne({
      user: userId,
      eventbriteId: eventId,
      interactionType: 'register'
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'Already registered for this event'
      });
    }

    // Get event details
    const event = await getEventbriteEventById(eventId);

    // Create registration interaction
    const interaction = await EventbriteInteraction.create({
      user: userId,
      eventbriteId: eventId,
      eventTitle: event.title,
      interactionType: 'register',
      metadata: {
        eventUrl: event.url,
        location: event.location,
        date: event.date
      }
    });

    console.log('Registration tracked successfully');

    res.status(201).json({
      success: true,
      data: interaction,
      redirectUrl: event.url // Frontend will redirect to Eventbrite
    });
  } catch (error) {
    console.error('Track registration error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to track registration'
    });
  }
});

// @desc    Get interaction stats for Eventbrite events (for organizers)
// @route   GET /api/eventbrite/stats
// @access  Private/Organizer
exports.getStats = asyncHandler(async (req, res) => {
  try {
    console.log('=== GET EVENTBRITE STATS ===');
    console.log('Organizer:', req.user.id, req.user.name);

    // Get all interactions grouped by event
    const stats = await EventbriteInteraction.aggregate([
      {
        $group: {
          _id: '$eventbriteId',
          eventTitle: { $first: '$eventTitle' },
          views: {
            $sum: { $cond: [{ $eq: ['$interactionType', 'view'] }, 1, 0] }
          },
          registrations: {
            $sum: { $cond: [{ $eq: ['$interactionType', 'register'] }, 1, 0] }
          },
          lastInteraction: { $max: '$createdAt' }
        }
      },
      {
        $sort: { lastInteraction: -1 }
      }
    ]);

    console.log('Found stats for', stats.length, 'Eventbrite events');

    res.status(200).json({
      success: true,
      count: stats.length,
      data: stats
    });
  } catch (error) {
    console.error('Get stats error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stats'
    });
  }
});

// @desc    Get stats for a specific Eventbrite event
// @route   GET /api/eventbrite/stats/:eventId
// @access  Private/Organizer
exports.getEventStats = asyncHandler(async (req, res) => {
  try {
    const { eventId } = req.params;

    console.log('=== GET EVENT STATS ===');
    console.log('Event:', eventId);

    const views = await EventbriteInteraction.countDocuments({
      eventbriteId: eventId,
      interactionType: 'view'
    });

    const registrations = await EventbriteInteraction.countDocuments({
      eventbriteId: eventId,
      interactionType: 'register'
    });

    const registeredUsers = await EventbriteInteraction.find({
      eventbriteId: eventId,
      interactionType: 'register'
    }).populate('user', 'name email');

    res.status(200).json({
      success: true,
      data: {
        eventbriteId: eventId,
        views,
        registrations,
        registeredUsers: registeredUsers.map(r => ({
          name: r.user.name,
          email: r.user.email,
          registeredAt: r.registeredAt
        }))
      }
    });
  } catch (error) {
    console.error('Get event stats error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event stats'
    });
  }
});

// @desc    Get user's registered Eventbrite events
// @route   GET /api/eventbrite/my-registrations
// @access  Private
exports.getMyRegistrations = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;

    console.log('=== GET MY EVENTBRITE REGISTRATIONS ===');
    console.log('User:', userId);

    const registrations = await EventbriteInteraction.find({
      user: userId,
      interactionType: 'register'
    }).sort({ createdAt: -1 });

    console.log('Found', registrations.length, 'registrations');

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations
    });
  } catch (error) {
    console.error('Get my registrations error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch registrations'
    });
  }
});

// @desc    Get all student registrations (Admin only)
// @route   GET /api/eventbrite/admin/registrations
// @access  Private/Admin/Organizer
exports.getAllRegistrations = asyncHandler(async (req, res) => {
  try {
    console.log('=== GET ALL STUDENT REGISTRATIONS (ADMIN) ===');
    console.log('Admin:', req.user.id, req.user.name);

    // Get all registrations with full student details
    const registrations = await EventbriteInteraction.find({ 
      interactionType: 'register' 
    })
    .populate('user', 'name email role createdAt')
    .sort({ createdAt: -1 });

    // Group by student for better organization
    const studentMap = {};
    registrations.forEach(reg => {
      const userId = reg.user._id.toString();
      if (!studentMap[userId]) {
        studentMap[userId] = {
          student: {
            id: reg.user._id,
            name: reg.user.name,
            email: reg.user.email,
            role: reg.user.role,
            joinedAt: reg.user.createdAt
          },
          registrations: [],
          totalEvents: 0
        };
      }
      studentMap[userId].registrations.push({
        eventId: reg.eventbriteId,
        eventTitle: reg.eventTitle,
        registeredAt: reg.registeredAt,
        eventUrl: reg.metadata?.eventUrl,
        location: reg.metadata?.location,
        date: reg.metadata?.date
      });
      studentMap[userId].totalEvents++;
    });

    // Convert to array
    const studentsData = Object.values(studentMap);

    console.log(`Found ${registrations.length} total registrations from ${studentsData.length} students`);

    res.status(200).json({
      success: true,
      totalRegistrations: registrations.length,
      totalStudents: studentsData.length,
      data: studentsData
    });
  } catch (error) {
    console.error('Get all registrations error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student registrations'
    });
  }
});

// @desc    Get student activity details (Admin only)
// @route   GET /api/eventbrite/admin/student/:studentId
// @access  Private/Admin/Organizer
exports.getStudentActivity = asyncHandler(async (req, res) => {
  try {
    const { studentId } = req.params;
    console.log('=== GET STUDENT ACTIVITY (ADMIN) ===');
    console.log('Student ID:', studentId);

    // Get all interactions (views + registrations) for this student
    const interactions = await EventbriteInteraction.find({ user: studentId })
      .populate('user', 'name email role')
      .sort({ createdAt: -1 });

    if (interactions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No activity found for this student'
      });
    }

    const views = interactions.filter(i => i.interactionType === 'view');
    const registrations = interactions.filter(i => i.interactionType === 'register');

    res.status(200).json({
      success: true,
      student: interactions[0].user,
      stats: {
        totalViews: views.length,
        totalRegistrations: registrations.length,
        totalInteractions: interactions.length
      },
      views: views.map(v => ({
        eventId: v.eventbriteId,
        eventTitle: v.eventTitle,
        viewedAt: v.createdAt
      })),
      registrations: registrations.map(r => ({
        eventId: r.eventbriteId,
        eventTitle: r.eventTitle,
        registeredAt: r.registeredAt,
        eventUrl: r.metadata?.eventUrl,
        location: r.metadata?.location
      }))
    });
  } catch (error) {
    console.error('Get student activity error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student activity'
    });
  }
});

// Module exports are at the top with exports.functionName syntax
// No need for additional module.exports at the end
