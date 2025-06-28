const mongoose = require('mongoose');
const Section = require('../models/section-model');

exports.getSections = async (req, res) => {
  try {
    const adminID = req.params.adminID;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      console.error(`Invalid adminID format: ${adminID}`);
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    console.log(`Fetching sections for adminID: ${adminID}`);
    const sections = await Section.find({ school: new mongoose.Types.ObjectId(adminID) })
      .sort({ createdAt: -1 })
      .lean();
    console.log(`Found ${sections.length} sections for adminID: ${adminID}`);
    res.status(200).json({
      message: 'Sections fetched successfully',
      data: sections,
      count: sections.length,
    });
  } catch (error) {
    console.error('Error fetching sections:', error.message);
    res.status(500).json({ message: 'Server error while fetching sections', error: error.message });
  }
};

exports.addSection = async (req, res) => {
  try {
    const { name, adminID } = req.body;
    if (!name || !adminID) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const existingSection = await Section.findOne({ name, school: new mongoose.Types.ObjectId(adminID) });
    if (existingSection) {
      return res.status(400).json({ message: 'Section with this name already exists' });
    }
    const newSection = new Section({
      name,
      school: new mongoose.Types.ObjectId(adminID),
    });
    await newSection.save();
    res.status(201).json({ message: 'Section added successfully', data: newSection });
  } catch (error) {
    console.error('Error adding section:', error.message);
    res.status(500).json({ message: 'Server error while adding section', error: error.message });
  }
};

exports.updateSection = async (req, res) => {
  try {
    const { name, adminID } = req.body;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const section = await Section.findOne({ _id: req.params.id, school: new mongoose.Types.ObjectId(adminID) });
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }
    if (name && name !== section.name) {
      const existingSection = await Section.findOne({ name, school: new mongoose.Types.ObjectId(adminID) });
      if (existingSection) {
        return res.status(400).json({ message: 'Section with this name already exists' });
      }
    }
    section.name = name || section.name;
    await section.save();
    res.status(200).json({ message: 'Section updated successfully', data: section });
  } catch (error) {
    console.error('Error updating section:', error.message);
    res.status(500).json({ message: 'Server error while updating section', error: error.message });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    const adminID = req.query.adminID;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const section = await Section.findOneAndDelete({ _id: req.params.id, school: new mongoose.Types.ObjectId(adminID) });
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }
    res.status(200).json({ message: 'Section deleted successfully' });
  } catch (error) {
    console.error('Error deleting section:', error.message);
    res.status(500).json({ message: 'Server error while deleting section', error: error.message });
  }
};