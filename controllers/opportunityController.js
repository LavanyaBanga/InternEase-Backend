// controllers/opportunityController.js
const asyncHandler = require('express-async-handler');
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');

// @desc    Get all opportunities with filtering
// @route   GET /api/opportunities
// @access  Public
const getOpportunities = asyncHandler(async (req, res) => {
  console.log('=== GET ALL OPPORTUNITIES (PUBLIC) ===');
  
  let query;
  const reqQuery = { ...req.query };
  const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
  removeFields.forEach(param => delete reqQuery[param]);
  
  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
  
  let findQuery = JSON.parse(queryStr);

  // Only show active opportunities
  findQuery.status = 'Active';

  // Text search logic
  if (req.query.search) {
      findQuery.title = { $regex: req.query.search, $options: 'i' };
  }
  
  query = Opportunity.find(findQuery).populate('organizer', 'name organizationName');

  if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
  } else {
      query = query.sort('-createdAt');
  }

  const opportunities = await query;
  
  console.log('Found opportunities:', opportunities.length);
  
  res.status(200).json({ 
    success: true, 
    count: opportunities.length, 
    data: opportunities 
  });
});

// @desc    Get single opportunity
// @route   GET /api/opportunities/:id
// @access  Public
const getOpportunityById = asyncHandler(async (req, res) => {
    const opportunity = await Opportunity.findById(req.params.id).populate('organizer', 'name organizationName');
    if (!opportunity) {
        res.status(404);
        throw new Error('Opportunity not found');
    }
    res.status(200).json({ success: true, data: opportunity });
});

// @desc    Create an opportunity
// @route   POST /api/opportunities
// @access  Private/Organizer
const createOpportunity = asyncHandler(async (req, res) => {
  console.log('=== CREATE OPPORTUNITY ===');
  console.log('User:', req.user.id, req.user.name);
  console.log('Body:', req.body);

  // Add organizer info
  req.body.organizer = req.user.id;
  req.body.organizerName = req.user.name || req.body.organizerName;

  // Parse JSON stringified arrays
  if (req.body.skills && typeof req.body.skills === 'string') {
    try {
      req.body.skills = JSON.parse(req.body.skills);
      console.log('Parsed skills:', req.body.skills);
    } catch (e) {
      console.error('Error parsing skills:', e);
    }
  }
  
  if (req.body.requirements && typeof req.body.requirements === 'string') {
    try {
      req.body.requirements = JSON.parse(req.body.requirements);
      console.log('Parsed requirements:', req.body.requirements);
    } catch (e) {
      console.error('Error parsing requirements:', e);
    }
  }
  
  if (req.body.responsibilities && typeof req.body.responsibilities === 'string') {
    try {
      req.body.responsibilities = JSON.parse(req.body.responsibilities);
      console.log('Parsed responsibilities:', req.body.responsibilities);
    } catch (e) {
      console.error('Error parsing responsibilities:', e);
    }
  }

  // Add poster path if file was uploaded
  if (req.file) {
    req.body.poster = '/uploads/' + req.file.filename;
    console.log('Poster path:', req.body.poster);
  }

  // Set default status if not provided
  if (!req.body.status) {
    req.body.status = 'Active';
  }

  console.log('Final data to save:', req.body);
  const opportunity = await Opportunity.create(req.body);
  console.log('Opportunity created in DB:', opportunity);

  res.status(201).json({ 
    success: true, 
    data: opportunity,
    message: 'Opportunity created successfully'
  });
});

// @desc    Update an opportunity
// @route   PUT /api/opportunities/:id
// @access  Private/Organizer
const updateOpportunity = asyncHandler(async (req, res) => {
  let opportunity = await Opportunity.findById(req.params.id);
  
  if (!opportunity) {
    res.status(404);
    throw new Error('Opportunity not found');
  }
  
  if (opportunity.organizer.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized to update this opportunity');
  }

  // Add poster path if file was uploaded
  if (req.file) {
    req.body.poster = '/uploads/' + req.file.filename;
  }

  opportunity = await Opportunity.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  
  res.status(200).json({ 
    success: true, 
    data: opportunity 
  });
});

// @desc    Delete an opportunity
// @route   DELETE /api/opportunities/:id
// @access  Private/Organizer
const deleteOpportunity = asyncHandler(async (req, res) => {
  const opportunity = await Opportunity.findById(req.params.id);
  
  if (!opportunity) {
    res.status(404);
    throw new Error('Opportunity not found');
  }
  
  if (opportunity.organizer.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized to delete this opportunity');
  }
  
  await opportunity.deleteOne();
  await Application.deleteMany({ opportunity: req.params.id });
  
  res.status(200).json({ 
    success: true, 
    message: 'Opportunity deleted'
  });
});

// @desc    Get organizer's opportunities
// @route   GET /api/opportunities/organizer/my-opportunities
// @access  Private (Organizer only)
const getOrganizerOpportunities = asyncHandler(async (req, res) => {
  console.log('=== GET ORGANIZER OPPORTUNITIES ===');
  console.log('User ID:', req.user.id);
  
  const opportunities = await Opportunity.find({ organizer: req.user.id })
    .sort({ createdAt: -1 });
  
  console.log('Found opportunities:', opportunities.length);

  res.status(200).json({
    success: true,
    count: opportunities.length,
    data: opportunities
  });
});

// @desc    Apply for opportunity
// @route   POST /api/opportunities/:id/apply
// @access  Private (Student only)
const applyForOpportunity = asyncHandler(async (req, res) => {
  const opportunity = await Opportunity.findById(req.params.id);

  if (!opportunity) {
    res.status(404);
    throw new Error('Opportunity not found');
  }

  // Check if already applied
  const alreadyApplied = opportunity.applicants.some(
    app => app.user.toString() === req.user.id
  );

  if (alreadyApplied) {
    res.status(400);
    throw new Error('Already applied for this opportunity');
  }

  // Add applicant
  opportunity.applicants.push({ user: req.user.id });
  await opportunity.save();

  res.status(200).json({
    success: true,
    message: 'Successfully applied for opportunity',
    data: opportunity
  });
});

// @desc    Track opportunity view
// @route   POST /api/opportunities/:id/view
// @access  Public
const trackOpportunityView = asyncHandler(async (req, res) => {
  const opportunity = await Opportunity.findById(req.params.id);

  if (!opportunity) {
    res.status(404);
    throw new Error('Opportunity not found');
  }

  // Increment views count
  opportunity.views += 1;
  await opportunity.save();

  res.status(200).json({
    success: true,
    data: { views: opportunity.views }
  });
});

module.exports = {
    getOpportunities,
    getOpportunityById,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
    getOrganizerOpportunities,
    applyForOpportunity,
    trackOpportunityView
};