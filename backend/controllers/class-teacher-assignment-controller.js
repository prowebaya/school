const mongoose = require('mongoose');
const ClassTeacherAssignment = require('../models/class-teacher-assignment-model');
const Teacher = require('../models/teacherModel');

exports.getClassTeacherAssignments = async (req, res) => {
  try {
    const adminID = req.params.adminID;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      console.error(`Invalid adminID format: ${adminID}`);
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    console.log(`Fetching class teacher assignments for adminID: ${adminID}`);
    const assignments = await ClassTeacherAssignment.find({ admin: new mongoose.Types.ObjectId(adminID) })
      .populate('teacher', 'fullName teacherId')
      .sort({ createdAt: -1 })
      .lean();
    console.log(`Found ${assignments.length} assignments for adminID: ${adminID}`);
    res.status(200).json({
      message: 'Class teacher assignments fetched successfully',
      data: assignments,
      count: assignments.length,
    });
  } catch (error) {
    console.error('Error fetching class teacher assignments:', error.message);
    res.status(500).json({ message: 'Server error while fetching assignments', error: error.message });
  }
};

exports.getTeachers = async (req, res) => {
  try {
    const adminID = req.params.adminID;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const teachers = await Teacher.find({ admin: new mongoose.Types.ObjectId(adminID) })
      .select('fullName teacherId')
      .lean();
    console.log(`Found ${teachers.length} teachers for adminID: ${adminID}`);
    res.status(200).json({
      message: 'Teachers fetched successfully',
      data: teachers.map((t) => ({ _id: t._id, label: `${t.fullName} (${t.teacherId})` })),
    });
  } catch (error) {
    console.error('Error fetching teachers:', error.message);
    res.status(500).json({ message: 'Server error while fetching teachers', error: error.message });
  }
};

exports.addClassTeacherAssignment = async (req, res) => {
  try {
    const { class: className, section, teacherId, adminID } = req.body;
    if (!className || !section || !teacherId || !adminID) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!mongoose.Types.ObjectId.isValid(adminID) || !mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({ message: 'Invalid adminID or teacherId format' });
    }
    const existingAssignment = await ClassTeacherAssignment.findOne({
      class: className,
      section,
      admin: new mongoose.Types.ObjectId(adminID),
    });
    if (existingAssignment) {
      return res.status(400).json({ message: 'Assignment for this class and section already exists' });
    }
    const newAssignment = new ClassTeacherAssignment({
      class: className,
      section,
      teacher: new mongoose.Types.ObjectId(teacherId),
      admin: new mongoose.Types.ObjectId(adminID),
    });
    await newAssignment.save();
    const populatedAssignment = await ClassTeacherAssignment.findById(newAssignment._id)
      .populate('teacher', 'fullName teacherId')
      .lean();
    res.status(201).json({ message: 'Class teacher assignment added successfully', data: populatedAssignment });
  } catch (error) {
    console.error('Error adding class teacher assignment:', error.message);
    res.status(500).json({ message: 'Server error while adding assignment', error: error.message });
  }
};

exports.updateClassTeacherAssignment = async (req, res) => {
  try {
    const { class: className, section, teacherId, adminID } = req.body;
    if (!mongoose.Types.ObjectId.isValid(adminID) || (teacherId && !mongoose.Types.ObjectId.isValid(teacherId))) {
      return res.status(400).json({ message: 'Invalid adminID or teacherId format' });
    }
    const assignment = await ClassTeacherAssignment.findOne({
      _id: req.params.id,
      admin: new mongoose.Types.ObjectId(adminID),
    });
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    const existingAssignment = await ClassTeacherAssignment.findOne({
      class: className || assignment.class,
      section: section || assignment.section,
      admin: new mongoose.Types.ObjectId(adminID),
      _id: { $ne: req.params.id },
    });
    if (existingAssignment) {
      return res.status(400).json({ message: 'Assignment for this class and section already exists' });
    }
    assignment.class = className || assignment.class;
    assignment.section = section || assignment.section;
    if (teacherId) assignment.teacher = new mongoose.Types.ObjectId(teacherId);
    await assignment.save();
    const populatedAssignment = await ClassTeacherAssignment.findById(assignment._id)
      .populate('teacher', 'fullName teacherId')
      .lean();
    res.status(200).json({ message: 'Class teacher assignment updated successfully', data: populatedAssignment });
  } catch (error) {
    console.error('Error updating class teacher assignment:', error.message);
    res.status(500).json({ message: 'Server error while updating assignment', error: error.message });
  }
};

exports.deleteClassTeacherAssignment = async (req, res) => {
  try {
    const adminID = req.query.adminID;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const assignment = await ClassTeacherAssignment.findOneAndDelete({
      _id: req.params.id,
      admin: new mongoose.Types.ObjectId(adminID),
    });
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    res.status(200).json({ message: 'Class teacher assignment deleted successfully' });
  } catch (error) {
    console.error('Error deleting class teacher assignment:', error.message);
    res.status(500).json({ message: 'Server error while deleting assignment', error: error.message });
  }
};