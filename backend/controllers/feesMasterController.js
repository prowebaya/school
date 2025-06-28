const mongoose = require('mongoose');
const FeesMaster = require('../models/feesMasterModel');
const FeeGroup = require('../models/feeGroupModel');
const FeeType = require('../models/feeTypeModel');
const { sanitize } = require('express-mongo-sanitize');

const sendResponse = (res, status, message, data = null, count = null) => {
  const response = { message };
  if (data !== null) response.data = data;
  if (count !== null) response.count = count;
  return res.status(status).json(response);
};

exports.getFeesMasters = async (req, res) => {
  try {
    const adminID = req.params.adminID;

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return sendResponse(res, 400, 'Invalid adminID format');
    }

    const feesMasters = await FeesMaster.find({ school: new mongoose.Types.ObjectId(adminID) })
      .populate('feesGroup', 'name')
      .populate('feesType', 'name code')
      .sort({ createdAt: -1 })
      .lean();

    return sendResponse(res, 200, 'Fees masters fetched successfully', feesMasters, feesMasters.length);
  } catch (error) {
    console.error('Error fetching fees masters:', error.message, error.stack);
    return sendResponse(res, 500, `Server error while fetching fees masters: ${error.message}`);
  }
};

exports.addFeesMaster = async (req, res) => {
  try {
    const { feesGroup, feesType, dueDate, amount, fineType, percentage, fixAmount, adminID } = sanitize(req.body);

    if (!feesGroup || !feesType || !dueDate || !amount || !adminID) {
      return sendResponse(res, 400, 'Missing required fields: feesGroup, feesType, dueDate, amount, adminID');
    }

    if (!mongoose.Types.ObjectId.isValid(adminID) || !mongoose.Types.ObjectId.isValid(feesGroup) || !mongoose.Types.ObjectId.isValid(feesType)) {
      return sendResponse(res, 400, 'Invalid ID format for adminID, feesGroup, or feesType');
    }

    // Validate FeeGroup and FeeType existence
    const [feeGroup, feeType] = await Promise.all([
      FeeGroup.findOne({ _id: feesGroup, school: adminID }),
      FeeType.findOne({ _id: feesType, school: adminID }),
    ]);

    if (!feeGroup || !feeType) {
      return sendResponse(res, 404, 'Fee group or fee type not found');
    }

    // Validate fine fields
    if (fineType === 'Percentage' && !percentage) {
      return sendResponse(res, 400, 'Percentage is required for fine type Percentage');
    }
    if (fineType === 'Fix Amount' && !fixAmount) {
      return sendResponse(res, 400, 'Fix Amount is required for fine type Fix Amount');
    }

    const feesCode = `${feeType.code}-${Date.now()}`;
    const fineAmount = fineType === 'Percentage' ? parseFloat(percentage) : fineType === 'Fix Amount' ? parseFloat(fixAmount) : 0;

    const newFeesMaster = new FeesMaster({
      feesGroup,
      feesType,
      dueDate,
      amount: parseFloat(amount),
      fineType,
      percentage: fineType === 'Percentage' ? parseFloat(percentage) : undefined,
      fixAmount: fineType === 'Fix Amount' ? parseFloat(fixAmount) : undefined,
      feesCode,
      perDay: 'No',
      fineAmount,
      school: new mongoose.Types.ObjectId(adminID),
    });

    await newFeesMaster.save();
    const populatedFeesMaster = await FeesMaster.findById(newFeesMaster._id)
      .populate('feesGroup', 'name')
      .populate('feesType', 'name code')
      .lean();

    return sendResponse(res, 201, 'Fees master added successfully', populatedFeesMaster);
  } catch (error) {
    console.error('Error adding fees master:', error.stack);
    if (error.code === 11000) {
      return sendResponse(res, 400, 'Fees master with this combination already exists');
    }
    return sendResponse(res, 500, 'Server error while adding fees master');
  }
};

exports.updateFeesMaster = async (req, res) => {
  try {
    const { feesGroup, feesType, dueDate, amount, fineType, percentage, fixAmount, adminID } = sanitize(req.body);

    if (!mongoose.Types.ObjectId.isValid(adminID) || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      return sendResponse(res, 400, 'Invalid ID format for adminID or fees master ID');
    }

    const feesMaster = await FeesMaster.findOne({
      _id: req.params.id,
      school: new mongoose.Types.ObjectId(adminID),
    });

    if (!feesMaster) {
      return sendResponse(res, 404, 'Fees master not found');
    }

    // Validate FeeGroup and FeeType if provided
    if (feesGroup && feesType) {
      if (!mongoose.Types.ObjectId.isValid(feesGroup) || !mongoose.Types.ObjectId.isValid(feesType)) {
        return sendResponse(res, 400, 'Invalid ID format for feesGroup or feesType');
      }

      const [feeGroup, feeType] = await Promise.all([
        FeeGroup.findOne({ _id: feesGroup, school: adminID }),
        FeeType.findOne({ _id: feesType, school: adminID }),
      ]);

      if (!feeGroup || !feeType) {
        return sendResponse(res, 404, 'Fee group or fee type not found');
      }

      feesMaster.feesGroup = feesGroup;
      feesMaster.feesType = feesType;
      feesMaster.feesCode = `${feeType.code}-${Date.now()}`;
    }

    // Update fields
    feesMaster.dueDate = dueDate || feesMaster.dueDate;
    feesMaster.amount = amount ? parseFloat(amount) : feesMaster.amount;
    feesMaster.fineType = fineType || feesMaster.fineType;

    if (fineType === 'Percentage') {
      if (!percentage) return sendResponse(res, 400, 'Percentage is required for fine type Percentage');
      feesMaster.percentage = parseFloat(percentage);
      feesMaster.fixAmount = undefined;
      feesMaster.fineAmount = parseFloat(percentage);
    } else if (fineType === 'Fix Amount') {
      if (!fixAmount) return sendResponse(res, 400, 'Fix Amount is required for fine type Fix Amount');
      feesMaster.fixAmount = parseFloat(fixAmount);
      feesMaster.percentage = undefined;
      feesMaster.fineAmount = parseFloat(fixAmount);
    } else {
      feesMaster.percentage = undefined;
      feesMaster.fixAmount = undefined;
      feesMaster.fineAmount = 0;
    }

    await feesMaster.save();
    const populatedFeesMaster = await FeesMaster.findById(feesMaster._id)
      .populate('feesGroup', 'name')
      .populate('feesType', 'name code')
      .lean();

    return sendResponse(res, 200, 'Fees master updated successfully', populatedFeesMaster);
  } catch (error) {
    console.error('Error updating fees master:', error.stack);
    if (error.code === 11000) {
      return sendResponse(res, 400, 'Fees master with this combination already exists');
    }
    return sendResponse(res, 500, 'Server error while updating fees master');
  }
};

exports.deleteFeesMaster = async (req, res) => {
  try {
    const adminID = req.query.adminID;

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return sendResponse(res, 400, 'Invalid adminID format');
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return sendResponse(res, 400, 'Invalid fees master ID format');
    }

    const feesMaster = await FeesMaster.findOneAndDelete({
      _id: req.params.id,
      school: new mongoose.Types.ObjectId(adminID),
    });

    if (!feesMaster) {
      return sendResponse(res, 404, 'Fees master not found');
    }

    return sendResponse(res, 200, 'Fees master deleted successfully');
  } catch (error) {
    console.error('Error deleting fees master:', error.stack);
    return sendResponse(res, 500, 'Server error while deleting fees master');
  }
};