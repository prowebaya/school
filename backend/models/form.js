const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
    dateOfBirth: { type: Date, required: true },
    bloodGroup: { type: String, trim: true },
    religion: { type: String, trim: true },
    nationality: { type: String, required: true, trim: true },
    maritalStatus: { type: String, trim: true },
    mobileNumber: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    currentAddress: { type: String, required: true, trim: true },
    permanentAddress: { type: String, trim: true },
    emergencyContact: { type: String, trim: true },
    highestQualification: { type: String, required: true, trim: true },
    specialization: { type: String, trim: true },
    certifications: { type: String, trim: true },
    experience: { type: Number, required: true },
    teacherId: { type: String, required: true, unique: true },
    joiningDate: { type: Date, required: true },
    department: { type: String, required: true },
    designation: { type: String, required: true, trim: true },
    salary: { type: Number, required: true },
    employmentType: {
      type: String,
      required: true,
      enum: ['Full-Time', 'Part-Time', 'Contract'],
    },
    status: { type: String, required: true, enum: ['Active', 'On Leave', 'Inactive'] },
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, default: 'Teacher', required: true },
    profilePhoto: { type: String },
    resume: { type: String },
    certificates: { type: String },
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  },
  {
    timestamps: true,
    indexes: [
      { key: { school: 1, email: 1 }, unique: true },
      { key: { teacherId: 1 } },
      { key: { username: 1 } },
    ],
  }
);

module.exports = mongoose.model('Teacher', teacherSchema);