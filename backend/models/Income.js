const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  incomeHead: {
    type: String,
    required: [true, 'Income head is required'],
    trim: true,
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  invoiceNumber: {
    type: String,
    trim: true,
    default: '',
  },
  date: {
    type: String,
    required: [true, 'Date is required'],
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be non-negative'],
  },
  document: {
    type: String,
    default: null,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'School ID is required'],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Income', incomeSchema);