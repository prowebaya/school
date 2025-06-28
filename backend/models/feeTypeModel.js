const mongoose = require('mongoose');

const feeTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true, unique: true },
    description: { type: String, trim: true },
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  },
  {
    timestamps: true,
    indexes: [
      { key: { school: 1, name: 1 }, unique: true },
      { key: { code: 1 }, unique: true },
    ],
  }
);

module.exports = mongoose.model('FeeType', feeTypeSchema);