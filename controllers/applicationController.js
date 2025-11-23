// controllers/applicationController.js
const asyncHandler = require('express-async-handler');
const Application = require('../models/Application');
const Opportunity = require('../models/Opportunity');
const Notification = require('../models/Notification');

// @desc    Apply to an opportunity
// @route   POST /api/applications/apply/:opportunityId
// @access  Private/Student
const applyToOpportunity = asyncHandler(async (req, res) => {
  const opportunityId = req.params.opportunityId;
  const userId = req.user.id;

  console.log('=== APPLY TO OPPORTUNITY ===');
  console.log('User ID:', userId);
  console.log('Opportunity ID:', opportunityId);
  console.log('Request body:', req.body);

  const opportunity = await Opportunity.findById(opportunityId);
  if (!opportunity) {
    res.status(404);
    throw new Error('Opportunity not found');
  }

  console.log('Found opportunity:', opportunity.title);

  const existingApplication = await Application.findOne({ user: userId, opportunity: opportunityId });
  if (existingApplication) {
    res.status(400);
    throw new Error('You have already applied for this opportunity');
  }

  // Create application with snapshot of opportunity details
  const application = await Application.create({
    user: userId,
    opportunity: opportunityId,
    status: 'applied',
    opportunitySnapshot: {
      title: opportunity.title,
      company: opportunity.company,
      type: opportunity.type,
      location: opportunity.location,
      stipend: opportunity.stipend,
      duration: opportunity.duration,
      description: opportunity.description,
      requirements: opportunity.requirements,
      skills: opportunity.skills,
      responsibilities: opportunity.responsibilities,
      deadline: opportunity.lastDate || opportunity.deadline,
      startDate: opportunity.startDate,
    },
    coverLetter: req.body.coverLetter || '',
    resume: req.body.resume || '',
    notes: req.body.notes || ''
  });
  
  console.log('Application created:', application._id);

  await Opportunity.findByIdAndUpdate(opportunityId, { $push: { applicants: userId } });

  await Notification.create({
      user: opportunity.organizer,
      message: `${req.user.name} has applied for your opportunity: ${opportunity.title}`,
      link: `/organizer/applications`
  });

  console.log('Application successful');

  res.status(201).json({ success: true, data: application });
});

// @desc    Get applications for the logged-in student
// @route   GET /api/applications/me
// @access  Private/Student
const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ user: req.user.id })
    .populate({
        path: 'opportunity',
        select: 'title type organizer',
        populate: {
            path: 'organizer',
            select: 'name organizationName'
        }
    });
  res.status(200).json({ success: true, count: applications.length, data: applications });
});

// @desc    Get all applications for opportunities created by the logged-in organizer
// @route   GET /api/applications/organizer
// @access  Private/Organizer
const getOrganizerApplications = asyncHandler(async (req, res) => {
    const opportunities = await Opportunity.find({ organizer: req.user.id }).select('_id');
    const opportunityIds = opportunities.map(op => op._id);

    const applications = await Application.find({ opportunity: { $in: opportunityIds } })
        .populate('user', 'name email resumeLink')
        .populate('opportunity', 'title');
    res.status(200).json({ success: true, count: applications.length, data: applications });
});

// @desc    Get applications with optional filters (e.g., by opportunity)
// @route   GET /api/applications?opportunity=:opportunityId
// @access  Private
const getApplications = asyncHandler(async (req, res) => {
  const { opportunity } = req.query;
  const filter = {};

  if (opportunity) {
    filter.opportunity = opportunity;
  }

  console.log('=== GET APPLICATIONS ===');
  console.log('Filter:', filter);

  const applications = await Application.find(filter)
    .populate('user', 'name email resumeLink')
    .populate('opportunity', 'title company');

  console.log('Found applications:', applications.length);

  res.status(200).json({ success: true, count: applications.length, data: applications });
});

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private/Organizer
const updateApplicationStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const application = await Application.findById(req.params.id).populate('opportunity');
    
    if(!application){
        res.status(404);
        throw new Error('Application not found');
    }

    if(application.opportunity.organizer.toString() !== req.user.id){
        res.status(401);
        throw new Error('User not authorized to update this application');
    }

    application.status = status;
    await application.save();
    
    await Notification.create({
        user: application.user,
        message: `Your application for "${application.opportunity.title}" has been ${status}.`,
        link: '/applications/me'
    });

    res.status(200).json({ success: true, data: application });
});

module.exports = {
    applyToOpportunity,
    getMyApplications,
    getOrganizerApplications,
    getApplications,
    updateApplicationStatus
};
