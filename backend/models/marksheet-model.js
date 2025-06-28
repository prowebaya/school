const mongoose = require('mongoose');

const marksheetSchema = new mongoose.Schema({
  template: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  class: {
    type: String,
    trim: true,
  },
  section: {
    type: String,
    trim: true,
  },
  studentName: {
    type: String,
    required: true,
    trim: true,
  },
  examCenter: {
    type: String,
    required: true,
    trim: true,
  },
  bodyText: {
    type: String,
    trim: true,
  },
  footerText: {
    type: String,
    trim: true,
  },
  printingDate: {
    type: Date,
    default: new Date('2025-06-26T07:37:00Z'), // Default to current date/time (07:37 AM IST, June 26, 2025)
  },
  headerImage: {
    type: String, // URL or file path
    trim: true,
  },
  leftLogo: {
    type: String, // URL or file path
    trim: true,
  },
  rightLogo: {
    type: String, // URL or file path
    trim: true,
  },
  leftSign: {
    type: String, // URL or file path
    trim: true,
  },
  rightSign: {
    type: String, // URL or file path
    trim: true,
  },
  backgroundImage: {
    type: String, // URL or file path
    trim: true,
  },
  options: {
    name: { type: Boolean, default: false },
    fatherName: { type: Boolean, default: false },
    motherName: { type: Boolean, default: false },
    examSession: { type: Boolean, default: false },
    admissionNo: { type: Boolean, default: false },
    division: { type: Boolean, default: false },
    rank: { type: Boolean, default: false },
    rollNumber: { type: Boolean, default: false },
    photo: { type: Boolean, default: false },
    classSection: { type: Boolean, default: false },
    dob: { type: Boolean, default: false },
    remark: { type: Boolean, default: false },
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Marksheet', marksheetSchema);