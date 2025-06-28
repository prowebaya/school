const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  visitorName: {
    type: String,
    required: [true, 'Visitor name is required'],
    trim: true,
  },
  meetingWith: {
    type: String,
    required: [true, 'Meeting with is required'],
    trim: true,
  },
  purpose: {
    type: String,
    required: [true, 'Purpose is required'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  idCard: {
    type: String,
    required: [true, 'ID card number is required'],
    trim: true,
  },
  numOfPerson: {
    type: Number,
    required: [true, 'Number of persons is required'],
    min: [1, 'Number of persons must be at least 1'],
  },
  date: {
    type: String,
    required: [true, 'Date is required'],
  },
  inTime: {
    type: String,
    required: [true, 'In time is required'],
  },
  outTime: {
    type: String,
    required: [true, 'Out time is required'],
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'School ID is required'],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Visitor', visitorSchema);