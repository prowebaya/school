const mongoose = require('mongoose');

const transportFeesSchema = new mongoose.Schema({
  month: {
    type: String,
    required: true,
    trim: true,
    enum: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
  },
  dueDate: {
    type: String,
    required: true,
    trim: true,
  },
  fineType: {
    type: String,
    required: true,
    enum: ['None', 'Percentage', 'Fix Amount'],
    default: 'None',
  },
  percentage: {
    type: String,
    trim: true,
    default: '',
  },
  fixedAmount: {
    type: String,
    trim: true,
    default: '',
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

// Ensure unique month per admin
transportFeesSchema.index({ month: 1, admin: 1 }, { unique: true });

module.exports = mongoose.model('TransportFees', transportFeesSchema);