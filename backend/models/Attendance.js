const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  timetable: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Timetable',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Leave'],
    required: true,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);