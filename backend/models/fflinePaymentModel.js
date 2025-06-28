const mongoose = require('mongoose');

const offlinePaymentSchema = new mongoose.Schema(
  {
    requestId: { type: Number, required: true, unique: true }, // Corresponds to 'id' in the frontend
    admissionFormId: { type: mongoose.Schema.Types.ObjectId, ref: 'AdmissionForm', required: true },
    admissionNo: { type: String, required: true },
    studentName: { type: String, required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    section: { type: String, required: true },
    paymentDate: { type: Date, required: true },
    submitDate: { type: Date, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    paymentId: { type: String, required: true, unique: true },
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  },
  {
    timestamps: true,
    indexes: [
      { key: { school: 1, requestId: 1 } },
      { key: { admissionNo: 1 } },
      { key: { paymentId: 1 } },
      { key: { submitDate: -1 } },
    ],
  }
);

module.exports = mongoose.model('OfflinePayment', offlinePaymentSchema);