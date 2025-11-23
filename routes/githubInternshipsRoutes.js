// routes/githubInternshipsRoutes.js
const express = require('express');
const router = express.Router();
const {
  getInternships,
  getInternshipById
} = require('../controllers/githubInternshipsController');

// Public routes - anyone can view GitHub internships
router.route('/').get(getInternships);
router.route('/:id').get(getInternshipById);

module.exports = router;
