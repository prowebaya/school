// models/StockItem.js
const mongoose = require('mongoose');

const StockItemSchema = new mongoose.Schema({
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
  supplier: {
    type: String,
    required: [true, 'Supplier is required'],
    enum: ['Camlin Stationers', 'Jhonson Uniform Dress', 'Jhon smith Supplier', 'David Furniture'],
  },
  store: {
    type: String,
    required: [true, 'Store is required'],
    enum: ['Chemistry Equipment (Ch201)', 'Science Store (SC2)', 'Uniform Dress Store (UND23)', 'Furniture Store (FS342)', 'Sports Store (sp55)'],
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
  },
  purchasePrice: {
    type: Number,
    required: [true, 'Purchase price is required'],
    min: [0, 'Purchase price cannot be negative'],
  },
  purchaseDate: {
    type: Date,
    required: [true, 'Purchase date is required'],
  },
  document: {
    type: String, // Path to uploaded file
    default: null,
  },
  description: {
    type: String,
    trim: true,
    default: '',
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

module.exports = mongoose.model('StockItem', StockItemSchema);