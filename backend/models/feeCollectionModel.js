const mongoose = require('mongoose');

const feeCollectionSchema = new mongoose.Schema(
  {
    admissionFormId: { type: mongoose.Schema.Types.ObjectId, ref: 'AdmissionHub', required: true }, // Updated ref
    studentName: { type: String, required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    section: { type: String, required: true },
    admissionNo: { type: String, required: true },
    feeType: { type: mongoose.Schema.Types.ObjectId, ref: 'FeeType', required: true },
    feesMasterId: { type: mongoose.Schema.Types.ObjectId, ref: 'FeesMaster' },
    amount: { type: Number, required: true },
    paid: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    fine: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
    dueDate: { type: Date, required: true },
    paymentDate: { type: Date },
    status: { type: String, enum: ['Paid', 'Pending', 'Overdue'], default: 'Pending' },
    feeGroupId: { type: mongoose.Schema.Types.ObjectId, ref: 'FeeGroup' },
    installmentNumber: { type: Number },
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  },
  {
    timestamps: true,
    indexes: [
      { key: { school: 1, admissionFormId: 1 } },
      { key: { admissionNo: 1 } },
      { key: { paymentDate: -1 } },
    ],
  }
);

feeCollectionSchema.pre('save', function (next) {
  this.balance = this.amount - this.paid - this.discount + this.fine;
  if (this.balance === 0) {
    this.status = 'Paid';
  } else if (this.dueDate < new Date() && this.balance > 0) {
    this.status = 'Overdue';
  }
  next();
});

module.exports = mongoose.models.FeeCollection || mongoose.model('FeeCollection', feeCollectionSchema);