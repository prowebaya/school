// Store Model (models/store-model.js)
const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  storeName: {
    type: String,
    required: true
  },
  storeCode: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// ✅ Define compound index properly:
storeSchema.index({ storeCode: 1, createdBy: 1 }, { unique: true });

module.exports = mongoose.model('Store', storeSchema);