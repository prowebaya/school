const mongoose = require('mongoose');

const disabledStudentSchema = mongoose.Schema(
  {
    reasonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reason', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'AdmissionForm', required: true },
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  },
  {
    timestamps: true,
    indexes: [
      { key: { school: 1, studentId: 1, reasonId: 1 }, unique: true },
    ],
  }
);

module.exports = mongoose.model('DisabledStudent', disabledStudentSchema);