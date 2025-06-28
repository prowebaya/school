const mongoose = require('mongoose');

const postalDispatchSchema = new mongoose.Schema({
  toTitle: {
    type: String,
    required: true,
    trim: true,
  },
  referenceNo: {
    type: String,
    required: true,
    trim: true,
  },
  fromTitle: {
    type: String,
    required: true,
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

module.exports = mongoose.model('PostalDispatch', postalDispatchSchema);