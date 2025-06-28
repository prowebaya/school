const mongoose = require('mongoose');

const transportRouteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Transport route title is required'],
    trim: true,
    maxlength: [100, 'Transport route title cannot exceed 100 characters'],
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'School ID is required'],
    ref: 'User',
  },
}, {
  timestamps: true,
});

transportRouteSchema.index({ title: 1, school: 1 }, { unique: true });

module.exports = mongoose.model('TransportRoute', transportRouteSchema);