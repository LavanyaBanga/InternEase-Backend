// controllers/githubInternshipsController.js
const asyncHandler = require('express-async-handler');
const { getGitHubInternships, getGitHubInternshipById } = require('../services/githubInternshipsService');

// @desc    Get all GitHub internships
// @route   GET /api/github-internships
// @access  Public
exports.getInternships = asyncHandler(async (req, res) => {
  try {
    console.log('=== GET GITHUB INTERNSHIPS ===');
    
    const options = {
      limit: parseInt(req.query.limit) || 50
    };

    const internships = await getGitHubInternships(options);
    
    console.log('Returning', internships.length, 'GitHub internships');
    
    res.status(200).json({
      success: true,
      count: internships.length,
      data: internships
    });
  } catch (error) {
    console.error('Get GitHub internships error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch GitHub internships'
    });
  }
});

// @desc    Get single GitHub internship
// @route   GET /api/github-internships/:id
// @access  Public
exports.getInternshipById = asyncHandler(async (req, res) => {
  try {
    const internship = await getGitHubInternshipById(req.params.id);
    
    res.status(200).json({
      success: true,
      data: internship
    });
  } catch (error) {
    console.error('Get GitHub internship error:', error.message);
    res.status(404).json({
      success: false,
      message: error.message || 'Internship not found'
    });
  }
});
