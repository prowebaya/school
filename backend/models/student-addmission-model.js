const mongoose = require('mongoose');

const admissionFormSchema = new mongoose.Schema(
  {
    admissionNo: { type: String, required: true, unique: true },
    rollNo: { type: String, default: '' },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    section: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, default: '' },
    gender: { type: String, enum: ['Male', 'Female', ''], default: '' },
    dob: { type: Date, required: true },
    routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'TransportRoute', default: null },
    pickupPointId: { type: mongoose.Schema.Types.ObjectId, ref: 'PickupPoint', default: null },
    feesMonth: { type: String, default: '' },
    fees: [
      {
        feeType: { type: String, required: true },
        dueDate: { type: Date, required: true },
        amount: { type: String, required: true },
      },
    ],
    parents: {
      father: {
        name: { type: String, default: '' },
        phone: { type: String, default: '' },
        occupation: { type: String, default: '' },
      },
      mother: {
        name: { type: String, default: '' },
        phone: { type: String, default: '' },
        occupation: { type: String, default: '' },
      },
    },
    additionalDetails: {
      aadharNumber: { type: String, default: '' },
      panNumber: { type: String, default: '' },
      tcNumber: { type: String, default: '' },
    },
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  },
  {
    timestamps: true,
    indexes: [
      { key: { school: 1, createdAt: -1 } },
      { key: { admissionNo: 1 } },
      { key: { firstName: 1, lastName: 1 } },
      { key: { classId: 1, section: 1 } },
    ],
  }
);

module.exports = mongoose.model('AdmissionForm', admissionFormSchema);