const mongoose = require('mongoose');

const reasonSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    reasonId: { type: Number, required: true, unique: true },
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  },
  {
    timestamps: true,
    indexes: [
      { key: { school: 1, text: 1 }, unique: true },
      { key: { reasonId: 1 } },
    ],
  }
);

module.exports = mongoose.model('Reason', reasonSchema);