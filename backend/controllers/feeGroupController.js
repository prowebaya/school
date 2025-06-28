const mongoose = require('mongoose');
const FeeGroup = require('../models/feeGroupModel');
const { sanitize } = require('express-mongo-sanitize');

const sendResponse = (res, status, message, data = null, count = null) => {
  const response = { message };
  if (data !== null) response.data = data;
  if (count !== null) response.count = count;
  return res.status(status).json(response);
};

exports.getFeeGroups = async (req, res) => {
  try {
    const adminID = req.params.adminID;

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return sendResponse(res, 400, 'Invalid adminID format');
    }

    const feeGroups = await FeeGroup.find({ school: new mongoose.Types.ObjectId(adminID) })
      .sort({ createdAt: -1 })
      .lean();

    return sendResponse(res, 200, 'Fee groups fetched successfully', feeGroups, feeGroups.length);
  } catch (error) {
    console.error('Error fetching fee groups:', error.message, error.stack);
    return sendResponse(res, 500, `Server error while fetching fee groups: ${error.message}`);
  }
};

exports.addFeeGroup = async (req, res) => {
  try {
    const { name, description, adminID } = sanitize(req.body);

    if (!name || !adminID) {
      return sendResponse(res, 400, 'Missing required fields: name, adminID');
    }

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return sendResponse(res, 400, 'Invalid adminID format');
    }

    const existingGroup = await FeeGroup.findOne({ name, school: new mongoose.Types.ObjectId(adminID) });
    if (existingGroup) {
      return sendResponse(res, 400, 'Fee group with this name already exists for this school');
    }

    const newFeeGroup = new FeeGroup({
      name,
      description,
      school: new mongoose.Types.ObjectId(adminID),
    });

    await newFeeGroup.save();
    return sendResponse(res, 201, 'Fee group added successfully', newFeeGroup);
  } catch (error) {
    console.error('Error adding fee group:', error.stack);
    return sendResponse(res, 500, 'Server error while adding fee group');
  }
};

exports.updateFeeGroup = async (req, res) => {
  try {
    const { name, description, adminID } = sanitize(req.body);

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return sendResponse(res, 400, 'Invalid adminID format');
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return sendResponse(res, 400, 'Invalid fee group ID format');
    }

    const feeGroup = await FeeGroup.findOne({
      _id: req.params.id,
      school: new mongoose.Types.ObjectId(adminID),
    });

    if (!feeGroup) {
      return sendResponse(res, 404, 'Fee group not found');
    }

    if (name && name !== feeGroup.name) {
      const existingGroup = await FeeGroup.findOne({ name, school: new mongoose.Types.ObjectId(adminID) });
      if (existingGroup) {
        return sendResponse(res, 400, 'Fee group with this name already exists for this school');
      }
      feeGroup.name = name;
    }

    feeGroup.description = description ?? feeGroup.description;
    await feeGroup.save();

    return sendResponse(res, 200, 'Fee group updated successfully', feeGroup);
  } catch (error) {
    console.error('Error updating fee group:', error.stack);
    return sendResponse(res, 500, 'Server error while updating fee group');
  }
};

exports.deleteFeeGroup = async (req, res) => {
  try {
    const adminID = req.query.adminID;

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return sendResponse(res, 400, 'Invalid adminID format');
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return sendResponse(res, 400, 'Invalid fee group ID format');
    }

    const feeGroup = await FeeGroup.findOneAndDelete({
      _id: req.params.id,
      school: new mongoose.Types.ObjectId(adminID),
    });

    if (!feeGroup) {
      return sendResponse(res, 404, 'Fee group not found');
    }

    return sendResponse(res, 200, 'Fee group deleted successfully');
  } catch (error) {
    console.error('Error deleting fee group:', error.stack);
    return sendResponse(res, 500, 'Server error while deleting fee group');
  }
};