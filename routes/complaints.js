const express = require('express');
const { createComplaint, getUserComplaints, deleteComplaint, updateComplaint } = require('../controllers/complaintController');
const auth = require('../middleware/auth');

const router = express.Router();

// Routes
router.post('/', auth, createComplaint); // Create a new complaint
router.get('/', auth, getUserComplaints); // Get complaints for the logged-in user

// Update a complaint
router.patch('/:id', auth, updateComplaint);

// Delete a complaint
router.delete('/:id', auth, deleteComplaint);

module.exports = router;