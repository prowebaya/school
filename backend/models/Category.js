const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    categoryId: { type: Number, required: true, unique: true }, // Auto-incremented ID
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  },
  {
    timestamps: true,
    indexes: [
      { key: { school: 1, name: 1 }, unique: true }, // Ensure unique categories per admin
      { key: { categoryId: 1 } },
    ],
  }
);

module.exports = mongoose.model('Category', categorySchema);