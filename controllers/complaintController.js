const Complaint = require('../models/Complaint');

const createComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.create({ ...req.body, user: req.user.id });
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user.id });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteComplaint = async (req, res) => {
  try {
    const deletedComplaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!deletedComplaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    res.json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    console.error('Error deleting complaint:', error); // Debugging
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateComplaint = async (req, res) => {
  try {
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedComplaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    res.json(updatedComplaint);
  } catch (error) {
    console.error('Error updating complaint:', error); // Debugging
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { createComplaint, getUserComplaints, deleteComplaint, updateComplaint };