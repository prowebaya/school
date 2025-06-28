const mongoose = require('mongoose');
const Reason = require('../models/reason');
const { sanitize } = require('express-mongo-sanitize');

const sendResponse = (res, status, message, data = null, count = null) => {
  const response = { message };
  if (data !== null) response.data = data;
  if (count !== null) response.count = count;
  return res.status(status).json(response);
};

// Generate a unique reasonId
const generateReasonId = async (schoolId) => {
  const lastReason = await Reason.findOne({ school: schoolId })
    .sort({ reasonId: -1 })
    .lean();
  return lastReason ? lastReason.reasonId + 1 : 1;
};

// Fetch all reasons
exports.getAllReasons = async (req, res) => {
  try {
    const { adminID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return sendResponse(res, 400, 'Invalid admin ID format');
    }

    const reasons = await Reason.find({ school: new mongoose.Types.ObjectId(adminID) })
      .sort({ text: 1 })
      .lean()
      .select('reasonId text');

    const formattedReasons = reasons.map((reason) => ({
      id: reason.reasonId,
      text: reason.text,
      _id: reason._id,
      isEditing: false,
    }));

    return sendResponse(res, 200, 'Reasons fetched successfully', formattedReasons, formattedReasons.length);
  } catch (error) {
    console.error('Error fetching reasons:', error.message, error.stack);
    return sendResponse(res, 500, `Server error while fetching reasons: ${error.message}`);
  }
};

// Create a new reason
exports.createReason = async (req, res) => {
  try {
    const { adminID } = req.params;
    const { text } = sanitize(req.body);

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return sendResponse(res, 400, 'Invalid admin ID format');
    }

    if (!text || text.trim() === '') {
      return sendResponse(res, 400, 'Reason text is required');
    }

    const existingReason = await Reason.findOne({
      school: new mongoose.Types.ObjectId(adminID),
      text: { $regex: `^${text.trim()}$`, $options: 'i' },
    });

    if (existingReason) {
      return sendResponse(res, 400, 'Reason already exists');
    }

    const reasonId = await generateReasonId(new mongoose.Types.ObjectId(adminID));

    const newReason = new Reason({
      text: text.trim(),
      reasonId,
      school: new mongoose.Types.ObjectId(adminID),
    });

    await newReason.save();

    return sendResponse(res, 201, 'Reason created successfully', {
      id: newReason.reasonId,
      text: newReason.text,
      _id: newReason._id,
      isEditing: false,
    });
  } catch (error) {
    console.error('Error creating reason:', error.message, error.stack);
    return sendResponse(res, 500, `Server error while creating reason: ${error.message}`);
  }
};

// Update a reason
exports.updateReason = async (req, res) => {
  try {
    const { adminID, reasonId } = req.params;
    const { text } = sanitize(req.body);

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return sendResponse(res, 400, 'Invalid admin ID format');
    }

    if (!mongoose.Types.ObjectId.isValid(reasonId)) {
      return sendResponse(res, 400, 'Invalid reason ID format');
    }

    if (!text || text.trim() === '') {
      return sendResponse(res, 400, 'Reason text is required');
    }

    const existingReason = await Reason.findOne({
      school: new mongoose.Types.ObjectId(adminID),
      text: { $regex: `^${text.trim()}$`, $options: 'i' },
      _id: { $ne: new mongoose.Types.ObjectId(reasonId) },
    });

    if (existingReason) {
      return sendResponse(res, 400, 'Reason already exists');
    }

    const updatedReason = await Reason.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(reasonId),
        school: new mongoose.Types.ObjectId(adminID),
      },
      { text: text.trim() },
      { new: true, runValidators: true }
    );

    if (!updatedReason) {
      return sendResponse(res, 404, 'Reason not found');
    }

    return sendResponse(res, 200, 'Reason updated successfully', {
      id: updatedReason.reasonId,
      text: updatedReason.text,
      _id: updatedReason._id,
      isEditing: false,
    });
  } catch (error) {
    console.error('Error updating reason:', error.message, error.stack);
    return sendResponse(res, 500, `Server error while updating reason: ${error.message}`);
  }
};

// Delete a reason
exports.deleteReason = async (req, res) => {
  try {
    const { adminID, reasonId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return sendResponse(res, 400, 'Invalid admin ID format');
    }

    if (!mongoose.Types.ObjectId.isValid(reasonId)) {
      return sendResponse(res, 400, 'Invalid reason ID format');
    }

    const result = await Reason.deleteOne({
      _id: new mongoose.Types.ObjectId(reasonId),
      school: new mongoose.Types.ObjectId(adminID),
    });

    if (result.deletedCount === 0) {
      return sendResponse(res, 404, 'Reason not found');
    }

    return sendResponse(res, 200, 'Reason deleted successfully');
  } catch (error) {
    console.error('Error deleting reason:', error.message, error.stack);
    return sendResponse(res, 500, `Server error while deleting reason: ${error.message}`);
  }
};