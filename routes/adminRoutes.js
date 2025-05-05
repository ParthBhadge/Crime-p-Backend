const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Complaint = require('../models/Complaint'); // Ensure the Complaint model is imported

// Middleware to check if the user is an admin
const adminAuth = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }
  next();
};

// Route to fetch all complaints
router.get('/complaints', auth, adminAuth, async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.json(complaints);
  } catch (err) {
    console.error('Error fetching complaints:', err);
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});

// Route to fetch complaints with user name populated
router.get('/admin/complaints', async (req, res) => {
  try {
    const complaints = await Complaint.find().populate('userId', 'name'); // Populate user name
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});

// Update complaint status
router.patch('/admin/complaints/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    res.json(updatedComplaint);
  } catch (error) {
    console.error('Error updating complaint status:', error);
    res.status(500).json({ error: 'Failed to update complaint status' });
  }
});

module.exports = router;