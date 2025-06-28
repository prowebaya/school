const mongoose = require('mongoose');

const markGradeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  from: {
    type: Number,
    required: true
  },
  to: {
    type: Number,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('MarkGrade', markGradeSchema);
