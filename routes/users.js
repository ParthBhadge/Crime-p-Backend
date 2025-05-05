// filepath: c:\Users\Parth\Desktop\jsx capstone 2 - Copy\backend\routes\users.js
const express = require('express');
const User = require('../models/User'); // Import the User model
const router = express.Router();

// Get user profile by email (or ID)
router.get('/profile', async (req, res) => {
  const { email } = req.query; // Assume email is passed as a query parameter
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;