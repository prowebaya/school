const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    complaintType: { type: String, required: true },
    source: {
      type: String,
      enum: ['Phone', 'Email', 'In-Person', ''], // Allow empty string for optional field
      default: '',
    },
    complainantType: {
      type: String,
      required: true,
      enum: ['Student', 'Parent', 'Staff', 'Other'],
    },
    date: { type: Date, required: true },
    description: { type: String, default: '' },
    actionTaken: {
      type: String,
      enum: ['Assigned', 'Pending', 'Resolved'],
      default: 'Pending',
    },
    note: { type: String, default: '' },
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  },
  {
    timestamps: true,
    indexes: [
      { key: { school: 1, createdAt: -1 } }, // Index for fetching complaints
      { key: { complaintType: 1 } }, // Index for filtering by complaint type
    ],
  }
);

module.exports = mongoose.model('Complaint', complaintSchema);