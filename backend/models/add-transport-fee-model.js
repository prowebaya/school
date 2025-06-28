const mongoose = require('mongoose');

const addTransportFeeSchema = new mongoose.Schema({
  admissionNo: {
    type: String,
    required: true,
    trim: true,
  },
  studentName: {
    type: String,
    required: true,
    trim: true,
  },
  class: {
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
    trim: true,
  },
  route: {
    type: String,
    required: true,
    trim: true,
  },
  vehicleNo: {
    type: String,
    required: true,
    trim: true,
  },
  pickupPoint: {
    type: String,
    required: true,
    trim: true,
  },
  feeAmount: {
    type: Number,
    required: true,
  },
  dueDate: {
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

module.exports = mongoose.model('AddTransportFee', addTransportFeeSchema);