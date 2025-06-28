const mongoose = require('mongoose');

const feeBalanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdmissionForm',
      required: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
    admissionNo: {
      type: String,
      required: true,
    },
    admissionDate: {
      type: Date,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    rollNumber: {
      type: String,
      default: '',
    },
    fatherName: {
      type: String,
      default: '',
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
  },
  {
    timestamps: true,
    indexes: [
      { key: { school: 1, classId: 1, section: 1 } },
      { key: { admissionNo: 1 } },
      { key: { student: 1 } },
    ],
  }
);

module.exports = mongoose.model('FeeBalance', feeBalanceSchema);