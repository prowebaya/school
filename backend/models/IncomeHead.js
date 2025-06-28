const mongoose = require('mongoose');

const incomeHeadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Income head name is required'],
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'School ID is required'],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('IncomeHead', incomeHeadSchema);