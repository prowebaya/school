const mongoose = require('mongoose');

const feesMasterSchema = new mongoose.Schema(
  {
    feesGroup: { type: mongoose.Schema.Types.ObjectId, ref: 'FeeGroup', required: true },
    feesType: { type: mongoose.Schema.Types.ObjectId, ref: 'FeeType', required: true },
    dueDate: { type: Date, required: true },
    amount: { type: Number, required: true },
    fineType: { type: String, enum: ['None', 'Percentage', 'Fix Amount'], default: 'None' },
    percentage: { type: Number },
    fixAmount: { type: Number },
    feesCode: { type: String, required: true, unique: true },
    perDay: { type: String, default: 'No' },
    fineAmount: { type: Number, default: 0 },
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  },
  {
    timestamps: true,
    indexes: [
      { key: { school: 1, feesGroup: 1, feesType: 1, dueDate: 1 }, unique: true },
    ],
  }
);

module.exports = mongoose.model('FeesMaster', feesMasterSchema);