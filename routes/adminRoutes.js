const express = require('express');
const router = express.Router();
const { getAllComplaints, updateComplaintStatus } = require('../controllers/adminController');

// Route to fetch all complaints (accessible to everyone)
router.get('/complaints', getAllComplaints);

// Route to update complaint status (accessible to everyone)
router.patch('/complaints/:id', updateComplaintStatus);

module.exports = router;