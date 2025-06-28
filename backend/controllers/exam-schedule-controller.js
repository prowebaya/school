
const mongoose = require('mongoose');
const ExamSchedule = require('../models/exam-schedule-model');
const ExamGroup = require('../models/exam-group-model');

exports.getExamSchedules = async (req, res) => {
  try {
    const adminID = req.params.adminID;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      console.error(`Invalid adminID format: ${adminID}`);
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    console.log(`Fetching exam schedules for adminID: ${adminID}`);
    const examSchedules = await ExamSchedule.find({ admin: new mongoose.Types.ObjectId(adminID) })
      .populate('examGroup') // Populate full examGroup object
      .sort({ createdAt: -1 })
      .lean();
    console.log(`Found ${examSchedules.length} exam schedules for adminID: ${adminID}`);
    res.status(200).json({
      message: 'Exam schedules fetched successfully',
      data: examSchedules,
      count: examSchedules.length,
    });
  } catch (error) {
    console.error('Error fetching exam schedules:', error.message);
    res.status(500).json({ message: 'Server error while fetching exam schedules', error: error.message });
  }
};

exports.addExamSchedule = async (req, res) => {
  try {
    const { name, date, time, duration, room, maxMarks, minMarks, examGroup, examType, adminID } = req.body;
    if (!name || !date || !time || !duration || !room || !maxMarks || !minMarks || !examGroup || !examType || !adminID) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!mongoose.Types.ObjectId.isValid(adminID) || !mongoose.Types.ObjectId.isValid(examGroup)) {
      return res.status(400).json({ message: 'Invalid adminID or examGroup ID format' });
    }
    const existingGroup = await ExamGroup.findOne({ _id: new mongoose.Types.ObjectId(examGroup), admin: new mongoose.Types.ObjectId(adminID) });
    if (!existingGroup) {
      return res.status(404).json({ message: 'Exam group not found' });
    }
    const existingSchedule = await ExamSchedule.findOne({
      name,
      examGroup: new mongoose.Types.ObjectId(examGroup),
      admin: new mongoose.Types.ObjectId(adminID),
    });
    if (existingSchedule) {
      return res.status(400).json({ message: 'Exam schedule with this name already exists for this group' });
    }
    const newExamSchedule = new ExamSchedule({
      name,
      date,
      time,
      duration,
      room,
      maxMarks,
      minMarks,
      examGroup: new mongoose.Types.ObjectId(examGroup),
      examType,
      admin: new mongoose.Types.ObjectId(adminID),
    });
    await newExamSchedule.save();
    res.status(201).json({ message: 'Exam schedule added successfully', data: newExamSchedule });
  } catch (error) {
    console.error('Error adding exam schedule:', error.message);
    res.status(500).json({ message: 'Server error while adding exam schedule', error: error.message });
  }
};

exports.updateExamSchedule = async (req, res) => {
  try {
    const { name, date, time, duration, room, maxMarks, minMarks, examGroup, examType, adminID } = req.body;
    if (!mongoose.Types.ObjectId.isValid(adminID) || (examGroup && !mongoose.Types.ObjectId.isValid(examGroup))) {
      return res.status(400).json({ message: 'Invalid adminID or examGroup ID format' });
    }
    const examSchedule = await ExamSchedule.findOne({ _id: req.params.id, admin: new mongoose.Types.ObjectId(adminID) });
    if (!examSchedule) {
      return res.status(404).json({ message: 'Exam schedule not found' });
    }
    if (examGroup) {
      const existingGroup = await ExamGroup.findOne({ _id: new mongoose.Types.ObjectId(examGroup), admin: new mongoose.Types.ObjectId(adminID) });
      if (!existingGroup) {
        return res.status(404).json({ message: 'Exam group not found' });
      }
    }
    const existingSchedule = await ExamSchedule.findOne({
      name,
      examGroup: new mongoose.Types.ObjectId(examGroup || examSchedule.examGroup),
      admin: new mongoose.Types.ObjectId(adminID),
      _id: { $ne: req.params.id },
    });
    if (existingSchedule) {
      return res.status(400).json({ message: 'Exam schedule with this name already exists for this group' });
    }
    examSchedule.name = name || examSchedule.name;
    examSchedule.date = date || examSchedule.date;
    examSchedule.time = time || examSchedule.time;
    examSchedule.duration = duration || examSchedule.duration;
    examSchedule.room = room || examSchedule.room;
    examSchedule.maxMarks = maxMarks || examSchedule.maxMarks;
    examSchedule.minMarks = minMarks || examSchedule.minMarks;
    examSchedule.examGroup = examGroup ? new mongoose.Types.ObjectId(examGroup) : examSchedule.examGroup;
    examSchedule.examType = examType || examSchedule.examType;
    await examSchedule.save();
    res.status(200).json({ message: 'Exam schedule updated successfully', data: examSchedule });
  } catch (error) {
    console.error('Error updating exam schedule:', error.message);
    res.status(500).json({ message: 'Server error while updating exam schedule', error: error.message });
  }
};

exports.deleteExamSchedule = async (req, res) => {
  try {
    const adminID = req.query.adminID;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const examSchedule = await ExamSchedule.findOneAndDelete({
      _id: req.params.id,
      admin: new mongoose.Types.ObjectId(adminID),
    });
    if (!examSchedule) {
      return res.status(404).json({ message: 'Exam schedule not found' });
    }
    res.status(200).json({ message: 'Exam schedule deleted successfully' });
  } catch (error) {
    console.error('Error deleting exam schedule:', error.message);
    res.status(500).json({ message: 'Server error while deleting exam schedule', error: error.message });
  }
};
