const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  quantity:    { type: Number, required: true },
  expiry:      { type: Date,   required: true },
  location:    { type: String, required: true },
  restaurant:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Food', foodSchema);
