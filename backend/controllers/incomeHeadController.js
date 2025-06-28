const mongoose = require('mongoose');
const IncomeHead = require('../models/IncomeHead');

exports.getIncomeHeads = async (req, res) => {
  try {
    const { adminID } = req.params;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const incomeHeads = await IncomeHead.find({
      school: new mongoose.Types.ObjectId(adminID),
    })
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json({
      message: 'Income heads fetched successfully',
      data: incomeHeads,
      count: incomeHeads.length,
    });
  } catch (error) {
    console.error(`Error fetching income heads: ${error.message}`);
    res.status(500).json({ message: 'Server error while fetching income heads', error: error.message });
  }
};

exports.addIncomeHead = async (req, res) => {
  try {
    const { adminID, name, description } = req.body;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const incomeHead = new IncomeHead({
      name,
      description,
      school: new mongoose.Types.ObjectId(adminID),
    });
    await incomeHead.save();
    res.status(201).json({ message: 'Income head added successfully', data: incomeHead });
  } catch (error) {
    console.error(`Error adding income head: ${error.message}`);
    res.status(500).json({ message: 'Server error while adding income head', error: error.message });
  }
};

exports.updateIncomeHead = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminID, name, description } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const incomeHead = await IncomeHead.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id), school: new mongoose.Types.ObjectId(adminID) },
      { name, description },
      { new: true, runValidators: true }
    );
    if (!incomeHead) {
      return res.status(404).json({ message: 'Income head not found' });
    }
    res.status(200).json({ message: 'Income head updated successfully', data: incomeHead });
  } catch (error) {
    console.error(`Error updating income head: ${error.message}`);
    res.status(500).json({ message: 'Server error while updating income head', error: error.message });
  }
};

exports.deleteIncomeHead = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminID } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const incomeHead = await IncomeHead.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(id),
      school: new mongoose.Types.ObjectId(adminID),
    });
    if (!incomeHead) {
      return res.status(404).json({ message: 'Income head not found' });
    }
    res.status(200).json({ message: 'Income head deleted successfully' });
  } catch (error) {
    console.error(`Error deleting income head: ${error.message}`);
    res.status(500).json({ message: 'Server error while deleting income head', error: error.message });
  }
};