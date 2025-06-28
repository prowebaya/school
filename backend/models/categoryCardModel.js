const mongoose = require('mongoose');

const categoryCardSchema = new mongoose.Schema({
  categoryCard: {
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
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  }
}, {
  timestamps: true
});
categoryCardSchema.index({ categoryCard: 1, createdBy: 1 }, { unique: true });

module.exports = mongoose.model('CategoryCard', categoryCardSchema);