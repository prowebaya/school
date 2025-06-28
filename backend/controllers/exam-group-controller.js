const mongoose = require('mongoose');
const ExamGroup = require('../models/exam-group-model');

exports.getExamGroups = async (req, res) => {
  try {
    const adminID = req.params.adminID;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      console.error(`Invalid adminID format: ${adminID}`);
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    console.log(`Fetching exam groups for adminID: ${adminID}`);
    const examGroups = await ExamGroup.find({ admin: new mongoose.Types.ObjectId(adminID) })
      .sort({ createdAt: -1 })
      .lean();
    console.log(`Found ${examGroups.length} exam groups for adminID: ${adminID}`);
    res.status(200).json({
      message: 'Exam groups fetched successfully',
      data: examGroups,
      count: examGroups.length,
    });
  } catch (error) {
    console.error('Error fetching exam groups:', error.message);
    res.status(500).json({ message: 'Server error while fetching exam groups', error: error.message });
  }
};

exports.addExamGroup = async (req, res) => {
  try {
    const { name, type, description, adminID } = req.body;
    if (!name || !type || !adminID) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const existingGroup = await ExamGroup.findOne({ name, admin: new mongoose.Types.ObjectId(adminID) });
    if (existingGroup) {
      return res.status(400).json({ message: 'Exam group name already exists' });
    }
    const newExamGroup = new ExamGroup({
      name,
      type,
      description: description || '',
      admin: new mongoose.Types.ObjectId(adminID),
    });
    await newExamGroup.save();
    res.status(201).json({ message: 'Exam group added successfully', data: newExamGroup });
  } catch (error) {
    console.error('Error adding exam group:', error.message);
    res.status(500).json({ message: 'Server error while adding exam group', error: error.message });
  }
};

exports.updateExamGroup = async (req, res) => {
  try {
    const { name, type, description, adminID } = req.body;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const examGroup = await ExamGroup.findOne({ _id: req.params.id, admin: new mongoose.Types.ObjectId(adminID) });
    if (!examGroup) {
      return res.status(404).json({ message: 'Exam group not found' });
    }
    const existingGroup = await ExamGroup.findOne({
      name,
      admin: new mongoose.Types.ObjectId(adminID),
      _id: { $ne: req.params.id },
    });
    if (existingGroup) {
      return res.status(400).json({ message: 'Exam group name already exists' });
    }
    examGroup.name = name || examGroup.name;
    examGroup.type = type || examGroup.type;
    examGroup.description = description || examGroup.description;
    await examGroup.save();
    res.status(200).json({ message: 'Exam group updated successfully', data: examGroup });
  } catch (error) {
    console.error('Error updating exam group:', error.message);
    res.status(500).json({ message: 'Server error while updating exam group', error: error.message });
  }
};

exports.deleteExamGroup = async (req, res) => {
  try {
    const adminID = req.query.adminID;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const examGroup = await ExamGroup.findOneAndDelete({
      _id: req.params.id,
      admin: new mongoose.Types.ObjectId(adminID),
    });
    if (!examGroup) {
      return res.status(404).json({ message: 'Exam group not found' });
    }
    res.status(200).json({ message: 'Exam group deleted successfully' });
  } catch (error) {
    console.error('Error deleting exam group:', error.message);
    res.status(500).json({ message: 'Server error while deleting exam group', error: error.message });
  }
};