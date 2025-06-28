// models/IssueItem.js
const mongoose = require('mongoose');

const IssueItemSchema = new mongoose.Schema({
  item: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Chemistry Lab Apparatus', 'Books Stationery', 'Staff Dress', 'Furniture', 'Sports'],
  },
  issueDate: {
    type: Date,
    required: [true, 'Issue date is required'],
  },
  issueTo: {
    type: String,
    required: [true, 'Issue to is required'],
    trim: true,
  },
  issuedBy: {
    type: String,
    required: [true, 'Issued by is required'],
    trim: true,
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: ['Issued', 'Returned'],
    default: 'Issued',
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: [true, 'Admin ID is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('IssueItem', IssueItemSchema);