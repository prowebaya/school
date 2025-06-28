const mongoose = require('mongoose');
const Visitor = require('../models/Visitor');

exports.getVisitors = async (req, res) => {
  try {
    const { adminID } = req.params;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const visitors = await Visitor.find({
      school: new mongoose.Types.ObjectId(adminID),
    })
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json({
      message: 'Visitors fetched successfully',
      data: visitors,
      count: visitors.length,
    });
  } catch (error) {
    console.error(`Error fetching visitors: ${error.message}`);
    res.status(500).json({ message: 'Server error while fetching visitors', error: error.message });
  }
};

exports.addVisitor = async (req, res) => {
  try {
    const { adminID, visitorName, meetingWith, purpose, phone, idCard, numOfPerson, date, inTime, outTime } = req.body;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const visitor = new Visitor({
      visitorName,
      meetingWith,
      purpose,
      phone,
      idCard,
      numOfPerson,
      date,
      inTime,
      outTime,
      school: new mongoose.Types.ObjectId(adminID),
    });
    await visitor.save();
    res.status(201).json({ message: 'Visitor added successfully', data: visitor });
  } catch (error) {
    console.error(`Error adding visitor: ${error.message}`);
    res.status(500).json({ message: 'Server error while adding visitor', error: error.message });
  }
};

exports.updateVisitor = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminID, visitorName, meetingWith, purpose, phone, idCard, numOfPerson, date, inTime, outTime } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const visitor = await Visitor.findOneAndUpdate(
      { _id: id, school: new mongoose.Types.ObjectId(adminID) },
      { visitorName, meetingWith, purpose, phone, idCard, numOfPerson, date, inTime, outTime },
      { new: true, runValidators: true }
    );
    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }
    res.status(200).json({ message: 'Visitor updated successfully', data: visitor });
  } catch (error) {
    console.error(`Error updating visitor: ${error.message}`);
    res.status(500).json({ message: 'Server error while updating visitor', error: error.message });
  }
};

exports.deleteVisitor = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminID } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const visitor = await Visitor.findOneAndDelete({
      _id: id,
      school: new mongoose.Types.ObjectId(adminID),
    });
    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }
    res.status(200).json({ message: 'Visitor deleted successfully' });
  } catch (error) {
    console.error(`Error deleting visitor: ${error.message}`);
    res.status(500).json({ message: 'Server error while deleting visitor', error: error.message });
  }
};