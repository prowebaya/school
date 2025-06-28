const mongoose = require('mongoose');
const Teacher = require('../models/teacherModel');
const path = require('path');

exports.addTeacherForm = async (req, res) => {
  try {
    console.log('Received request to /teacher-form');
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);

    const adminID = req.body.adminID;
    const formData = req.body;
    const files = req.files;

    if (!adminID || !mongoose.Types.ObjectId.isValid(adminID)) {
      console.error(`Invalid or missing adminID: ${adminID}`);
      return res.status(400).json({ message: 'Invalid or missing adminID' });
    }

    // Validate files
    if (!files || !files.profilePhoto || !files.profilePhoto[0]) {
      console.error('Profile photo is missing or invalid');
      return res.status(400).json({ message: 'Profile photo is required' });
    }

    // Validate required fields
    const requiredFields = [
      'fullName', 'gender', 'dateOfBirth', 'nationality', 'mobileNumber', 'email',
      'currentAddress', 'highestQualification', 'experience', 'teacherId', 'joiningDate',
      'department', 'designation', 'salary', 'employmentType', 'status', 'username', 'password',
    ];
    for (const field of requiredFields) {
      if (!formData[field]) {
        console.error(`Missing required field: ${field}`);
        return res.status(400).json({ message: `${field} is required` });
      }
    }

    // Get file paths from multer
    const profilePhotoPath = `/Uploads/${files.profilePhoto[0].filename}`;
    const resumePath = files.resume ? `/Uploads/${files.resume[0].filename}` : null;
    const certificatesPath = files.certificates ? `/Uploads/${files.certificates[0].filename}` : null;

    // Prepare teacher data
    const teacherData = {
      ...formData,
      profilePhoto: profilePhotoPath,
      resume: resumePath,
      certificates: certificatesPath,
      school: new mongoose.Types.ObjectId(adminID),
    };

    console.log('Saving teacher data:', teacherData);

    const newTeacher = new Teacher(teacherData);
    await newTeacher.save();

    console.log('Added new teacher form submission:', newTeacher);
    res.status(201).json({ message: 'Teacher form submitted successfully', data: newTeacher });
  } catch (error) {
    console.error('Error in addTeacherForm:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Duplicate field value', field: Object.keys(error.keyValue)[0] });
    }
    if (error.message.includes('Only PDF, DOC, DOCX, JPG, JPEG, and PNG files are allowed')) {
      return res.status(400).json({ message: error.message });
    }
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size exceeds 10MB limit' });
    }
    res.status(500).json({ message: 'Server error while adding teacher form', error: error.message });
  }
};

exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTeacher = async (req, res) => {
  try {
    const updates = req.body;
    if (req.files?.profilePhoto) {
      updates.profilePhotoPath = req.files.profilePhoto[0].filename;
    }
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    if (teacher.profilePhotoPath) {
      fs.unlinkSync(path.join(__dirname, '../Uploads', teacher.profilePhotoPath));
    }
    res.status(200).json({ message: 'Teacher deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};