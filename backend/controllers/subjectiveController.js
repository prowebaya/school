const mongoose = require('mongoose');
const Subjective = require('../models/subjectiveModel');

exports.getSubjectives = async (req, res) => {
  try {
    const adminID = req.params.adminID;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      console.error(`Invalid adminID format: ${adminID}`);
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    console.log(`Fetching subjectives for adminID: ${adminID}`);
    const subjectives = await Subjective.find({ admin: new mongoose.Types.ObjectId(adminID) })
      .sort({ createdAt: -1 })
      .lean();
    console.log(`Found ${subjectives.length} subjectives for adminID: ${adminID}`);
    res.status(200).json({
      message: 'Subjectives fetched successfully',
      data: subjectives,
      count: subjectives.length,
    });
  } catch (error) {
    console.error('Error fetching subjectives:', error.message);
    res.status(500).json({ message: 'Server error while fetching subjectives', error: error.message });
  }
};

exports.addSubjective = async (req, res) => {
  try {
    const { name, code, type, adminID } = req.body;
    if (!name || !code || !type || !adminID) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const existingSubjective = await Subjective.findOne({ code, admin: new mongoose.Types.ObjectId(adminID) });
    if (existingSubjective) {
      return res.status(400).json({ message: 'Subjective code already exists' });
    }
    const newSubjective = new Subjective({
      name,
      code,
      type,
      admin: new mongoose.Types.ObjectId(adminID),
    });
    await newSubjective.save();
    res.status(201).json({ message: 'Subjective added successfully', data: newSubjective });
  } catch (error) {
    console.error('Error adding subjective:', error.message);
    res.status(500).json({ message: 'Server error while adding subjective', error: error.message });
  }
};

exports.updateSubjective = async (req, res) => {
  try {
    const { name, code, type, adminID } = req.body;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const subjective = await Subjective.findOne({ _id: req.params.id, admin: new mongoose.Types.ObjectId(adminID) });
    if (!subjective) {
      return res.status(404).json({ message: 'Subjective not found' });
    }
    const existingSubjective = await Subjective.findOne({
      code,
      admin: new mongoose.Types.ObjectId(adminID),
      _id: { $ne: req.params.id },
    });
    if (existingSubjective) {
      return res.status(400).json({ message: 'Subjective code already exists' });
    }
    subjective.name = name || subjective.name;
    subjective.code = code || subjective.code;
    subjective.type = type || subjective.type;
    await subjective.save();
    res.status(200).json({ message: 'Subjective updated successfully', data: subjective });
  } catch (error) {
    console.error('Error updating subjective:', error.message);
    res.status(500).json({ message: 'Server error while updating subjective', error: error.message });
  }
};

exports.deleteSubjective = async (req, res) => {
  try {
    const adminID = req.query.adminID;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const subjective = await Subjective.findOneAndDelete({
      _id: req.params.id,
      admin: new mongoose.Types.ObjectId(adminID),
    });
    if (!subjective) {
      return res.status(404).json({ message: 'Subjective not found' });
    }
    res.status(200).json({ message: 'Subjective deleted successfully' });
  } catch (error) {
    console.error('Error deleting subjective:', error.message);
    res.status(500).json({ message: 'Server error while deleting subjective', error: error.message });
  }
};