// controllers/githubCoursesController.js
const asyncHandler = require('express-async-handler');
const { getGitHubCourses, getGitHubCourseById } = require('../services/githubCoursesService');

/**
 * @desc    Get all GitHub Education courses
 * @route   GET /api/github-courses
 * @access  Public
 */
const getCourses = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  
  const courses = await getGitHubCourses({ limit });
  
  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses
  });
});

/**
 * @desc    Get single GitHub course by ID
 * @route   GET /api/github-courses/:id
 * @access  Public
 */
const getCourseById = asyncHandler(async (req, res) => {
  const course = await getGitHubCourseById(req.params.id);
  
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }
  
  res.status(200).json({
    success: true,
    data: course
  });
});

module.exports = {
  getCourses,
  getCourseById
};
