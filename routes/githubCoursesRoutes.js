// routes/githubCoursesRoutes.js
const express = require('express');
const router = express.Router();
const { getCourses, getCourseById } = require('../controllers/githubCoursesController');

// Public routes - no authentication required
router.get('/', getCourses);
router.get('/:id', getCourseById);

module.exports = router;
