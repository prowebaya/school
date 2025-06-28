const mongoose = require('mongoose');

const examResultSchema = new mongoose.Schema({
  admissionNo: {
    type: String,
    required: true,
    trim: true,
  },
  rollNo: {
    type: String,
    required: true,
    trim: true,
  },
  studentName: {
    type: String,
    required: true,
    trim: true,
  },
  examGroup: {
    type: String,
    required: true,
    trim: true,
  },
  examType: {
    type: String,
    required: true,
    trim: true,
  },
  session: {
    type: String,
    required: true,
    trim: true,
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  section: {
    type: String,
    required: true,
    trim: true,
  },
  subjects: [
    {
      subjectName: {
        type: String,
        required: true,
        trim: true,
      },
      marksObtained: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },
      maxMarks: {
        type: Number,
        required: true,
        default: 100,
      },
      subjectCode: {
        type: String,
        required: true,
        trim: true,
      },
    },
  ],
  grandTotal: {
    type: Number,
    required: true,
  },
  percent: {
    type: Number,
    required: true,
  },
  rank: {
    type: Number,
    required: true,
  },
  result: {
    type: String,
    enum: ['Pass', 'Fail'],
    required: true,
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

module.exports = mongoose.model('ExamResult', examResultSchema);