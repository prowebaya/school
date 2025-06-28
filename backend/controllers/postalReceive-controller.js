const mongoose = require('mongoose');
const PostalReceive = require('../models/postalReceive-model');
const path = require('path');
const fs = require('fs');

// Get all postal receives for an admin
exports.getPostalReceives = async (req, res) => {
  try {
    const adminID = req.params.adminID;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      console.error(`Invalid adminID format: ${adminID}`);
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    console.log(`Fetching postal receives for adminID: ${adminID}`);
    const receives = await PostalReceive.find({ adminID: new mongoose.Types.ObjectId(adminID) })
      .sort({ createdAt: -1 })
      .lean();
    console.log(`Found ${receives.length} postal receives for adminID: ${adminID}`);
    res.status(200).json({
      message: 'Postal receives fetched successfully',
      data: receives,
      count: receives.length,
    });
  } catch (error) {
    console.error('Error fetching postal receives:', error.message);
    res.status(500).json({ message: 'Server error while fetching postal receives', error: error.message });
  }
};

// Add a new postal receive
exports.addPostalReceive = async (req, res) => {
  try {
    const { fromTitle, referenceNo, address, note, toTitle, date, adminID } = req.body;
    if (!fromTitle || !date || !adminID) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }

    const newReceive = new PostalReceive({
      fromTitle,
      referenceNo,
      address,
      note,
      toTitle,
      date,
      document: req.file ? req.file.path : null,
      adminID: new mongoose.Types.ObjectId(adminID),
    });

    await newReceive.save();
    console.log(`Added new postal receive: ${newReceive._id}`);
    res.status(201).json({ message: 'Postal receive added successfully', data: newReceive });
  } catch (error) {
    console.error('Error adding postal receive:', error.message);
    res.status(500).json({ message: 'Server error while adding postal receive', error: error.message });
  }
};

// Update an existing postal receive
exports.updatePostalReceive = async (req, res) => {
  try {
    const { fromTitle, referenceNo, address, note, toTitle, date, adminID } = req.body;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }

    const receive = await PostalReceive.findOne({ _id: req.params.id, adminID: new mongoose.Types.ObjectId(adminID) });
    if (!receive) {
      return res.status(404).json({ message: 'Postal receive not found' });
    }

    // Update fields
    receive.fromTitle = fromTitle || receive.fromTitle;
    receive.referenceNo = referenceNo || receive.referenceNo;
    receive.address = address || receive.address;
    receive.note = note || receive.note;
    receive.toTitle = toTitle || receive.toTitle;
    receive.date = date || receive.date;

    // Handle file update
    if (req.file) {
      // Delete old file if exists
      if (receive.document) {
        fs.unlinkSync(path.join(__dirname, '..', receive.document));
      }
      receive.document = req.file.path;
    }

    await receive.save();
    console.log(`Updated postal receive: ${receive._id}`);
    res.status(200).json({ message: 'Postal receive updated successfully', data: receive });
  } catch (error) {
    console.error('Error updating postal receive:', error.message);
    res.status(500).json({ message: 'Server error while updating postal receive', error: error.message });
  }
};

// Delete a postal receive
exports.deletePostalReceive = async (req, res) => {
  try {
    const adminID = req.query.adminID;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }

    const receive = await PostalReceive.findOne({ _id: req.params.id, adminID: new mongoose.Types.ObjectId(adminID) });
    if (!receive) {
      return res.status(404).json({ message: 'Postal receive not found' });
    }

    // Delete file if exists
    if (receive.document) {
      fs.unlinkSync(path.join(__dirname, '..', receive.document));
    }

    await PostalReceive.deleteOne({ _id: req.params.id });
    console.log(`Deleted postal receive: ${req.params.id}`);
    res.status(200).json({ message: 'Postal receive deleted successfully' });
  } catch (error) {
    console.error('Error deleting postal receive:', error.message);
    res.status(500).json({ message: 'Server error while deleting postal receive', error: error.message });
  }
};