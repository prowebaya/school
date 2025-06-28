const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true,
    maxlength: 100,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  unit: {
    type: String,
    required: true,
    enum: ['Piece', 'Kg', 'Liter', 'Pack']
  },
  availableQuantity: {
    type: Number,
    required: true,
    min: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

itemSchema.index({ item: 1, createdBy: 1 }, { unique: true });

module.exports = mongoose.model('Item', itemSchema);