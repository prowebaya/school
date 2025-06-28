const mongoose = require('mongoose');

const supplierSchema  = new mongoose.Schema({
 name: {
    type: String,
    required: true,
    maxlength: 100
  },
  phone: {
    type: String,
    trim: true,
    maxlength: 20
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    maxlength: 100
  },
  address: {
    type: String,
    trim: true,
    maxlength: 200
  },
  contactPersonName: {
    type: String,
    trim: true,
    maxlength: 100
  },
   contactPersonPhone: {
    type: String,
    trim: true,
    maxlength: 20
  },
  contactPersonEmail: {
    type: String,
    trim: true,
    lowercase: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
  }, {
  timestamps: true

});
// ✅ Define compound index properly:
supplierSchema.index({ name: 1, createdBy: 1 }, { unique: true });

module.exports = mongoose.model('Supplier', supplierSchema);