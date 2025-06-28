const mongoose = require('mongoose');
const SearchStudent = require('../models/SearchStudent');
const SearchClass = require('../models/fclass-model');

exports.getClasses = async (req, res) => {
  try {
    const adminID = req.params.adminID;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      console.error(`Invalid adminID format: ${adminID}`);
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    console.log(`Fetching classes for adminID: ${adminID}`);
    const classes = await SearchClass.find({ admin: new mongoose.Types.ObjectId(adminID) })
      .select('name sections')
      .lean();
    console.log(`Found ${classes.length} classes`);
    res.status(200).json({
      message: 'Classes fetched successfully',
      data: classes,
    });
  } catch (error) {
    console.error('Error fetching classes:', error.message);
    res.status(500).json({ message: 'Server error while fetching classes', error: error.message });
  }
};

exports.searchStudents = async (req, res) => {
  try {
    const { rollNo, admissionNo, classId, section, adminID } = req.query;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const query = { admin: new mongoose.Types.ObjectId(adminID) };

    if (rollNo) {
      query.rollNo = { $regex: rollNo, $options: 'i' };
    }
    if (admissionNo) {
      query.admissionNo = { $regex: admissionNo, $options: 'i' };
    }
    if (classId && mongoose.Types.ObjectId.isValid(classId)) {
      query.class = new mongoose.Types.ObjectId(classId);
    }
    if (section) {
      query.section = section;
    }

    const students = await SearchStudent.find(query)
      .populate('class', 'name')
      .lean();
    console.log(`Found ${students.length} students`);
    res.status(200).json({
      message: 'Students fetched successfully',
      data: students,
    });
  } catch (error) {
    console.error('Error searching students:', error.message);
    res.status(500).json({ message: 'Server error while searching students', error: error.message });
  }
};