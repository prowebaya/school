const mongoose = require('mongoose');
const SubjectGroup = require('../models/SubjectGroup');

exports.getSubjectGroups = async (req, res) => {
  try {
    const { adminID } = req.query;

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }

    const subjectGroups = await SubjectGroup.find({
      admin: new mongoose.Types.ObjectId(adminID),
    }).sort({ createdAt: -1 }).lean();

    res.status(200).json({
      message: 'Subject groups fetched successfully',
      data: subjectGroups,
      count: subjectGroups.length,
    });
  } catch (error) {
    console.error('Error fetching subject groups:', error.message);
    res.status(500).json({ message: 'Server error while fetching subject groups', error: error.message });
  }
};

exports.addOrUpdateSubjectGroup = async (req, res) => {
  try {
    const { name, class: className, section, subjects, adminID } = req.body;

    if (!name || !className || !section || !subjects || !subjects.length || !mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'All fields are required, including at least one subject' });
    }

    const existingGroup = await SubjectGroup.findOne({ name, admin: adminID });

    if (existingGroup) {
      const updatedGroup = await SubjectGroup.findOneAndUpdate(
        { name, admin: adminID },
        {
          $push: {
            classes: { class: className, section, subjects },
          },
        },
        { new: true }
      );
      return res.status(200).json({ message: 'Subject group updated successfully', data: updatedGroup });
    }

    const newGroup = new SubjectGroup({
      name,
      classes: [{ class: className, section, subjects }],
      admin: adminID,
    });

    await newGroup.save();
    res.status(201).json({ message: 'Subject group created successfully', data: newGroup });
  } catch (error) {
    console.error('Error adding/updating subject group:', error.message);
    res.status(500).json({ message: 'Server error while adding/updating subject group', error: error.message });
  }
};

exports.deleteClassFromGroup = async (req, res) => {
  try {
    const { groupId, classIndex, adminID } = req.body;

    if (!mongoose.Types.ObjectId.isValid(groupId) || !mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid groupId or adminID format' });
    }

    const group = await SubjectGroup.findOne({ _id: groupId, admin: adminID });
    if (!group) {
      return res.status(404).json({ message: 'Subject group not found' });
    }

    if (classIndex < 0 || classIndex >= group.classes.length) {
      return res.status(400).json({ message: 'Invalid class index' });
    }

    group.classes.splice(classIndex, 1);

    if (group.classes.length === 0) {
      await SubjectGroup.deleteOne({ _id: groupId, admin: adminID });
      return res.status(200).json({ message: 'Subject group deleted as no classes remain' });
    }

    await group.save();
    res.status(200).json({ message: 'Class removed from subject group successfully', data: group });
  } catch (error) {
    console.error('Error deleting class from subject group:', error.message);
    res.status(500).json({ message: 'Server error while deleting class from subject group', error: error.message });
  }
};