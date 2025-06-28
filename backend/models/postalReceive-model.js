const mongoose = require('mongoose');

const postalReceiveSchema = new mongoose.Schema({
  fromTitle: {
    type: String,
    required: true,
    trim: true,
  },
  referenceNo: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  note: {
    type: String,
    trim: true,
  },
  toTitle: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  document: {
    type: String, // Store file path
    default: null,
  },
  adminID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('PostalReceive', postalReceiveSchema);