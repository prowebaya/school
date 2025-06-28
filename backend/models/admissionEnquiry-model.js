const mongoose = require('mongoose');

const admissionEnquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  source: {
    type: String,
    required: true,
    enum: ['Front Office', 'Advertisement', 'Google Ads', 'Admission Campaign'],
  },
  className: {
    type: String,
    required: true,
    enum: ['1', '2', '3', '4'],
  },
  enquiryDate: {
    type: Date,
    required: true,
  },
  lastFollowUp: {
    type: Date,
    required: true,
  },
  nextFollowUp: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['Active', 'Passive', 'Dead', 'Won', 'Lost'],
    default: 'Active',
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('AdmissionEnquiry', admissionEnquirySchema);