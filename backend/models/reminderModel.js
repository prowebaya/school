const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: ['Active', 'Inactive'],
      required: [true, 'Action is required'],
      default: 'Active',
    },
    type: {
      type: String,
      enum: ['before', 'after'],
      required: [true, 'Reminder type is required'],
    },
    days: {
      type: Number,
      required: [true, 'Days is required'],
      min: [1, 'Days must be at least 1'],
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: [true, 'School is required'],
    },
  },
  {
    timestamps: true,
    indexes: [{ key: { school: 1, type: 1, days: 1 }, unique: true }],
  }
);

module.exports = mongoose.model('Reminder', reminderSchema);