const mongoose = require('mongoose');

const frontOfficeEntrySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['Purpose', 'Complaint Type', 'Source', 'Reference'],
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('FrontOfficeEntry', frontOfficeEntrySchema);