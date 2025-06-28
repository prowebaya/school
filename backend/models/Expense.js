const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  expenseHead: {
    type: String,
    required: true,
    enum: ['Miscellaneous', 'Stationery Purchase', 'Electricity Bill', 'Telephone Bill', 'Flower', 'Educational Trip'],
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  invoiceNumber: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  attachedFile: {
    type: String, // Store file path or URL if uploaded
    trim: true,
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

module.exports = mongoose.model('Expense', expenseSchema);