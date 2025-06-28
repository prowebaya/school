const mongoose = require('mongoose');

const subjectGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  classes: [
    {
      class: {
        type: String,
        required: true,
        trim: true,
      },
      section: {
        type: String,
        required: true,
        trim: true,
      },
      subjects: [
        {
          type: String,
          required: true,
          trim: true,
        },
      ],
    },
  ],
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('SubjectGroup', subjectGroupSchema);