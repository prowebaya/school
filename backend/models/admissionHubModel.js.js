const mongoose = require('mongoose');

// Define the schema
const admissionHubSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true, trim: true },
    admissionNo: { type: String, required: true, unique: true, trim: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    section: { type: String, required: true, trim: true },
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  },
  {
    timestamps: true,
    indexes: [
      { key: { school: 1, admissionNo: 1 }, unique: true },
    ],
  }
);

// Prevent model overwrite by checking if the model exists
module.exports = mongoose.models.AdmissionHub || mongoose.model('AdmissionHub', admissionHubSchema);