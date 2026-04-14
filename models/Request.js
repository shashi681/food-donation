const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
  ngo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'completed', 'rejected'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);
