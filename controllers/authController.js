// controllers/authController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Function to generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, organizationName, contactInfo } = req.body;

  console.log('=== REGISTRATION ATTEMPT ===');
  console.log('Email:', email);
  console.log('Password length:', password?.length);
  console.log('Role:', role);

  if (!name || !email || !password || !role) {
    res.status(400);
    throw new Error('Please add all required fields');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    organizationName: role === 'organizer' ? organizationName : undefined,
    contactInfo: role === 'organizer' ? contactInfo : undefined,
  });

  console.log('User created successfully');
  console.log('Password was hashed:', user.password?.substring(0, 20) + '...');

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log('=== LOGIN ATTEMPT ===');
  console.log('Email:', email);
  console.log('Password length:', password?.length);

  const user = await User.findOne({ email }).select('+password');

  console.log('User found:', !!user);
  if (user) {
    console.log('User email:', user.email);
    console.log('Stored password hash:', user.password?.substring(0, 20) + '...');
    const isMatch = await user.matchPassword(password);
    console.log('Password match:', isMatch);
  }

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
};