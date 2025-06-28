const mongoose = require('mongoose');
const FeeType = require('../models/feeTypeModel');
const { sanitize } = require('express-mongo-sanitize');

const sendResponse = (res, status, message, data = null, count = null) => {
  const response = { message };
  if (data !== null) response.data = data;
  if (count !== null) response.count = count;
  return res.status(status).json(response);
};

exports.getFeeTypes = async (req, res) => {
  try {
    const adminID = req.params.adminID;

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return sendResponse(res, 400, 'Invalid adminID format');
    }

    const feeTypes = await FeeType.find({ school: new mongoose.Types.ObjectId(adminID) })
      .sort({ createdAt: -1 })
      .lean();

    return sendResponse(res, 200, 'Fee types fetched successfully', feeTypes, feeTypes.length);
  } catch (error) {
    console.error('Error fetching fee types:', error.message, error.stack);
    return sendResponse(res, 500, `Server error while fetching fee types: ${error.message}`);
  }
};

exports.addFeeType = async (req, res) => {
  try {
    const { name, code, description, adminID } = sanitize(req.body);

    if (!name || !code || !adminID) {
      return sendResponse(res, 400, 'Missing required fields: name, code, adminID');
    }

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return sendResponse(res, 400, 'Invalid adminID format');
    }

    const normalizedCode = code.trim().toLowerCase().replace(/\s+/g, '-');

    const existingFeeType = await FeeType.findOne({
      $or: [
        { name, school: new mongoose.Types.ObjectId(adminID) },
        { code: normalizedCode },
      ],
    });

    if (existingFeeType) {
      return sendResponse(
        res,
        400,
        existingFeeType.name === name
          ? 'Fee type with this name already exists for this school'
          : 'Fee type with this code already exists'
      );
    }

    const newFeeType = new FeeType({
      name,
      code: normalizedCode,
      description,
      school: new mongoose.Types.ObjectId(adminID),
    });

    await newFeeType.save();
    return sendResponse(res, 201, 'Fee type added successfully', newFeeType);
  } catch (error) {
    console.error('Error adding fee type:', error.stack);
    return sendResponse(res, 500, 'Server error while adding fee type');
  }
};

exports.updateFeeType = async (req, res) => {
  try {
    const { name, code, description, adminID } = sanitize(req.body);

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return sendResponse(res, 400, 'Invalid adminID format');
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return sendResponse(res, 400, 'Invalid fee type ID format');
    }

    const feeType = await FeeType.findOne({
      _id: req.params.id,
      school: new mongoose.Types.ObjectId(adminID),
    });

    if (!feeType) {
      return sendResponse(res, 404, 'Fee type not found');
    }

    const normalizedCode = code ? code.trim().toLowerCase().replace(/\s+/g, '-') : feeType.code;

    if (name && name !== feeType.name) {
      const existingName = await FeeType.findOne({
        name,
        school: new mongoose.Types.ObjectId(adminID),
        _id: { $ne: req.params.id },
      });
      if (existingName) {
        return sendResponse(res, 400, 'Fee type with this name already exists for this school');
      }
      feeType.name = name;
    }

    if (code && normalizedCode !== feeType.code) {
      const existingCode = await FeeType.findOne({
        code: normalizedCode,
        _id: { $ne: req.params.id },
      });
      if (existingCode) {
        return sendResponse(res, 400, 'Fee type with this code already exists');
      }
      feeType.code = normalizedCode;
    }

    feeType.description = description ?? feeType.description;
    await feeType.save();

    return sendResponse(res, 200, 'Fee type updated successfully', feeType);
  } catch (error) {
    console.error('Error updating fee type:', error.stack);
    return sendResponse(res, 500, 'Server error while updating fee type');
  }
};

exports.deleteFeeType = async (req, res) => {
  try {
    const adminID = req.query.adminID;

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return sendResponse(res, 400, 'Invalid adminID format');
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return sendResponse(res, 400, 'Invalid fee type ID format');
    }

    const feeType = await FeeType.findOneAndDelete({
      _id: req.params.id,
      school: new mongoose.Types.ObjectId(adminID),
    });

    if (!feeType) {
      return sendResponse(res, 404, 'Fee type not found');
    }

    return sendResponse(res, 200, 'Fee type deleted successfully');
  } catch (error) {
    console.error('Error deleting fee type:', error.stack);
    return sendResponse(res, 500, 'Server error while deleting fee type');
  }
};