const mongoose = require('mongoose');

const examGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  type: {
    type: String,
    required: true,
    trim: true,
    enum: [
      'General Purpose (Pass/Fail)',
      'School Based Grading System',
      'College Based Grading System',
      'GPA Grading System',
      'Average Passing',
    ],
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  exams: {
    type: Number,
    default: 0,
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

module.exports = mongoose.model('ExamGroup', examGroupSchema);