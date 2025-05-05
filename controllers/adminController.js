const Complaint = require('../models/Complaint');

const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate('user', 'name email');
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateComplaintStatus = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllComplaints, updateComplaintStatus };