const mongoose = require('mongoose');
const PostalDispatch = require('../models/postalDispatch-model');
const path = require('path');
const fs = require('fs');

// Get all postal dispatches for an admin
exports.getPostalDispatches = async (req, res) => {
  try {
    const adminID = req.params.adminID;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      console.error(`Invalid adminID format: ${adminID}`);
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    console.log(`Fetching postal dispatches for adminID: ${adminID}`);
    const dispatches = await PostalDispatch.find({ adminID: new mongoose.Types.ObjectId(adminID) })
      .sort({ createdAt: -1 })
      .lean();
    console.log(`Found ${dispatches.length} postal dispatches for adminID: ${adminID}`);
    res.status(200).json({
      message: 'Postal dispatches fetched successfully',
      data: dispatches,
      count: dispatches.length,
    });
  } catch (error) {
    console.error('Error fetching postal dispatches:', error.message);
    res.status(500).json({ message: 'Server error while fetching postal dispatches', error: error.message });
  }
};

// Add a new postal dispatch
exports.addPostalDispatch = async (req, res) => {
  try {
    const { toTitle, referenceNo, fromTitle, date, adminID } = req.body;
    if (!toTitle || !referenceNo || !fromTitle || !date || !adminID) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }

    const newDispatch = new PostalDispatch({
      toTitle,
      referenceNo,
      fromTitle,
      date,
      document: req.file ? req.file.path : null,
      adminID: new mongoose.Types.ObjectId(adminID),
    });

    await newDispatch.save();
    console.log(`Added new postal dispatch: ${newDispatch._id}`);
    res.status(201).json({ message: 'Postal dispatch added successfully', data: newDispatch });
  } catch (error) {
    console.error('Error adding postal dispatch:', error.message);
    res.status(500).json({ message: 'Server error while adding postal dispatch', error: error.message });
  }
};

// Update an existing postal dispatch
exports.updatePostalDispatch = async (req, res) => {
  try {
    const { toTitle, referenceNo, fromTitle, date, adminID } = req.body;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }

    const dispatch = await PostalDispatch.findOne({ _id: req.params.id, adminID: new mongoose.Types.ObjectId(adminID) });
    if (!dispatch) {
      return res.status(404).json({ message: 'Postal dispatch not found' });
    }

    // Update fields
    dispatch.toTitle = toTitle || dispatch.toTitle;
    dispatch.referenceNo = referenceNo || dispatch.referenceNo;
    dispatch.fromTitle = fromTitle || dispatch.fromTitle;
    dispatch.date = date || dispatch.date;

    // Handle file update
    if (req.file) {
      // Delete old file if exists
      if (dispatch.document) {
        fs.unlinkSync(path.join(__dirname, '..', dispatch.document));
      }
      dispatch.document = req.file.path;
    }

    await dispatch.save();
    console.log(`Updated postal dispatch: ${dispatch._id}`);
    res.status(200).json({ message: 'Postal dispatch updated successfully', data: dispatch });
  } catch (error) {
    console.error('Error updating postal dispatch:', error.message);
    res.status(500).json({ message: 'Server error while updating postal dispatch', error: error.message });
  }
};

// Delete a postal dispatch
exports.deletePostalDispatch = async (req, res) => {
  try {
    const adminID = req.query.adminID;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }

    const dispatch = await PostalDispatch.findOne({ _id: req.params.id, adminID: new mongoose.Types.ObjectId(adminID) });
    if (!dispatch) {
      return res.status(404).json({ message: 'Postal dispatch not found' });
    }

    // Delete file if exists
    if (dispatch.document) {
      fs.unlinkSync(path.join(__dirname, '..', dispatch.document));
    }

    await PostalDispatch.deleteOne({ _id: req.params.id });
    console.log(`Deleted postal dispatch: ${req.params.id}`);
    res.status(200).json({ message: 'Postal dispatch deleted successfully' });
  } catch (error) {
    console.error('Error deleting postal dispatch:', error.message);
    res.status(500).json({ message: 'Server error while deleting postal dispatch', error: error.message });
  }
};