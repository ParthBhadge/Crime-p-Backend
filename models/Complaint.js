const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  address: { type: String, required: true },
  complaintType: { type: String, required: true },
  gender: { type: String, required: true },
  state: { type: String, required: true },
  complaint: { type: String, required: true },
  status: { type: String, default: 'Pending' }, // Default status
  createdAt: { type: Date, default: Date.now }, // Timestamp
});

module.exports = mongoose.model('Complaint', complaintSchema);