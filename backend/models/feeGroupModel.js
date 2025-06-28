const mongoose = require('mongoose');

const feeGroupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  },
  {
    timestamps: true,
    indexes: [
      { key: { school: 1, name: 1 }, unique: true },
    ],
  }
);

module.exports = mongoose.model('FeeGroup', feeGroupSchema);