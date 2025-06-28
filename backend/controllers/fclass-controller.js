const mongoose = require('mongoose');
const Fclass = require('../models/fclass-model');

exports.getClasses = async (req, res) => {
  try {
    const adminID = req.params.adminID;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      console.error(`Invalid adminID format: ${adminID}`);
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    console.log(`Fetching classes for adminID: ${adminID}`);
    const classes = await Fclass.find({ school: new mongoose.Types.ObjectId(adminID) })
      .sort({ createdAt: -1 })
      .lean();
    console.log(`Found ${classes.length} classes for adminID: ${adminID}`);
    res.status(200).json({
      message: 'Classes fetched successfully',
      data: classes,
      count: classes.length,
    });
  } catch (error) {
    console.error('Error fetching classes:', error.message);
    res.status(500).json({ message: 'Server error while fetching classes', error: error.message });
  }
};

exports.addClass = async (req, res) => {
  try {
    const { name, sections, adminID } = req.body;
    if (!name || !adminID) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const newClass = new Fclass({
      name,
      sections: sections || [],
      school: new mongoose.Types.ObjectId(adminID),
    });
    await newClass.save();
    res.status(201).json({ message: 'Class added successfully', data: newClass });
  } catch (error) {
    console.error('Error adding class:', error.message);
    res.status(500).json({ message: 'Server error while adding class', error: error.message });
  }
};

exports.updateClass = async (req, res) => {
  try {
    const { name, sections, adminID } = req.body;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const fclass = await Fclass.findOne({ _id: req.params.id, school: new mongoose.Types.ObjectId(adminID) });
    if (!fclass) {
      return res.status(404).json({ message: 'Class not found' });
    }
    fclass.name = name || fclass.name;
    fclass.sections = sections || fclass.sections;
    await fclass.save();
    res.status(200).json({ message: 'Class updated successfully', data: fclass });
  } catch (error) {
    console.error('Error updating class:', error.message);
    res.status(500).json({ message: 'Server error while updating class', error: error.message });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const adminID = req.query.adminID;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const fclass = await Fclass.findOneAndDelete({ _id: req.params.id, school: new mongoose.Types.ObjectId(adminID) });
    if (!fclass) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.status(200).json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error('Error deleting class:', error.message);
    res.status(500).json({ message: 'Server error while deleting class', error: error.message });
  }
};