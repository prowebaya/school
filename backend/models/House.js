const mongoose = require('mongoose');

const houseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    class: { type: String, trim: true, default: '' },
    houseId: { type: Number, required: true, unique: true },
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  },
  {
    timestamps: true,
    indexes: [
      { key: { school: 1, name: 1 }, unique: true },
      { key: { houseId: 1 } },
    ],
  }
);

module.exports = mongoose.model('House', houseSchema);