const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  admissionNo: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  fatherName: {
    type: String,
    required: true,
    trim: true,
  },
  dob: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  currentResult: {
    type: String,
    enum: ['Pass', 'Fail'],
    default: 'Pass',
  },
  nextSessionStatus: {
    type: String,
    enum: ['Continue', 'Leave'],
    default: 'Continue',
  },
  session: {
    type: String,
    required: true,
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

module.exports = mongoose.model('Promotion', promotionSchema);