const mongoose = require('mongoose');
const Teacher = require('../models/form');
const { sanitize } = require('express-mongo-sanitize');
const path = require('path');
const fs = require('fs');

const sendResponse = (res, status, message, data = null) => {
  const response = { message };
  if (data !== null) response.data = data;
  return res.status(status).json(response);
};

const generateTeacherId = async (schoolId) => {
  const lastTeacher = await Teacher.findOne({ school: schoolId })
    .sort({ teacherId: -1 })
    .lean();
  const lastId = lastTeacher ? parseInt(lastTeacher.teacherId.replace('T', '')) : 0;
  return `T${lastId + 1}`;
};

exports.getAllTeachers = async (req, res) => {
  try {
    const { adminID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return sendResponse(res, 400, 'Invalid admin ID format');
    }

    const teachers = await Teacher.find({ school: adminID }).select(
      '_id teacherId fullName email department designation status'
    ).lean();

    return sendResponse(res, 200, 'Teachers fetched successfully', {
      teachers,
      count: teachers.length,
    });
  } catch (error) {
    console.error('Error fetching teachers:', error.message, error.stack);
    return sendResponse(res, 500, `Server error while fetching teachers: ${error.message}`);
  }
};

// src/backend/controllers/teacherController.js
exports.createTeacher = async (req, res) => {
  try {
    const { adminID } = req.params;
    const {
      fullName,
      gender,
      dateOfBirth,
      bloodGroup,
      religion,
      nationality,
      maritalStatus,
      mobileNumber,
      email,
      currentAddress,
      permanentAddress,
      emergencyContact,
      highestQualification,
      specialization,
      certifications,
      experience,
      teacherId,
      joiningDate,
      department,
      designation,
      salary,
      employmentType,
      status,
      username,
      password,
      role,
    } = req.body; // No need for sanitize if express-mongo-sanitize middleware is used

    // Convert stringified numbers to actual numbers
    const parsedExperience = parseFloat(experience);
    const parsedSalary = parseFloat(salary);

    if (isNaN(parsedExperience) || isNaN(parsedSalary)) {
      return sendResponse(res, 400, 'Experience and Salary must be valid numbers');
    }

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return sendResponse(res, 400, 'Invalid admin ID format');
    }

    if (!fullName || !email || !teacherId || !username || !password) {
      return sendResponse(res, 400, 'Required fields are missing');
    }

    const existingTeacher = await Teacher.findOne({
      $or: [
        { school: adminID, email },
        { school: adminID, teacherId },
        { school: adminID, username },
      ],
    });

    if (existingTeacher) {
      return sendResponse(res, 400, 'Teacher with email, teacher ID, or username already exists');
    }

    const newTeacherId = teacherId || (await generateTeacherId(adminID));

    const teacher = new Teacher({
      fullName,
      gender,
      dateOfBirth,
      bloodGroup,
      religion,
      nationality,
      maritalStatus,
      mobileNumber,
      email,
      currentAddress,
      permanentAddress,
      emergencyContact,
      highestQualification,
      specialization,
      certifications,
      experience: parsedExperience,
      teacherId: newTeacherId,
      joiningDate,
      department,
      designation,
      salary: parsedSalary,
      employmentType,
      status,
      username,
      password: await require('bcrypt').hash(password, 10), // Hash password
      role: role || 'Teacher',
      school: adminID,
    });

    // Handle file uploads
    if (req.files) {
      const files = req.files;
      if (files.profilePhoto) {
        teacher.profilePhoto = `/Uploads/${files.profilePhoto[0].filename}`;
      }
      if (files.resume) {
        teacher.resume = `/Uploads/${files.resume[0].filename}`;
      }
      if (files.certificates) {
        teacher.certificates = `/Uploads/${files.certificates[0].filename}`;
      }
    }

    await teacher.save();

    return sendResponse(res, 201, 'Teacher created successfully', {
      _id: teacher._id,
      teacherId: teacher.teacherId,
      fullName: teacher.fullName,
      email: teacher.email,
    });
  } catch (error) {
    console.error('Error creating teacher:', error.message, error.stack);
    return sendResponse(res, 500, `Server error while creating teacher: ${error.message}`);
  }
};