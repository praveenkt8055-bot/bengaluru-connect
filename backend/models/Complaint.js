const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String },
  category: { type: String }, 
  priority: { type: String }, 
  status: { type: String, default: 'Pending' },
  locationName: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  verifyResult: {
    match: { type: Boolean },
    confidenceScore: { type: Number }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Complaint', ComplaintSchema);
