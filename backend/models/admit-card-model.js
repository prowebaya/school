const mongoose = require('mongoose');

const admitCardSchema = new mongoose.Schema({
  template: {
    type: String,
    required: true,
    trim: true,
  },
  studentName: {
    type: String,
    required: true,
    trim: true,
  },
  examName: {
    type: String,
    required: true,
    trim: true,
  },
  examDate: {
    type: Date,
    required: true,
  },
  examCenter: {
    type: String,
    required: true,
    trim: true,
  },
  footerText: {
    type: String,
    trim: true,
  },
  printingDate: {
    type: Date,
    default: Date.now,
  },
  leftLogo: {
    type: String, // Store URL or file path of the image
    trim: true,
  },
  rightLogo: {
    type: String, // Store URL or file path of the image
    trim: true,
  },
  sign: {
    type: String, // Store URL or file path of the image
    trim: true,
  },
  backgroundImage: {
    type: String, // Store URL or file path of the image
    trim: true,
  },
  subjects: [
    {
      subject: { type: String, trim: true },
      date: { type: Date },
    },
  ],
  options: {
    name: { type: Boolean, default: true },
    fatherName: { type: Boolean, default: false },
    motherName: { type: Boolean, default: false },
    admissionNo: { type: Boolean, default: true },
    rollNumber: { type: Boolean, default: true },
    dob: { type: Boolean, default: false },
    gender: { type: Boolean, default: false },
    photo: { type: Boolean, default: false },
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

module.exports = mongoose.model('AdmitCard', admitCardSchema);