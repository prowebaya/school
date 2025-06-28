const mongoose = require('mongoose');
const FeeCollection = require('../models/feeCollectionModel');
const AdmissionForm = require('../models/student-addmission-model');
const { sanitize } = require('express-mongo-sanitize');

const sendResponse = (res, status, message, data = null, count = null) => {
  const response = { message };
  if (data !== null) response.data = data;
  if (count !== null) response.count = count;
  return res.status(status).json(response);
};

exports.getFeeCollections = async (req, res) => {
  try {
    const adminID = req.params.adminID;

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return sendResponse(res, 400, 'Invalid adminID format');
    }

    const feeCollections = await FeeCollection.find({ school: new mongoose.Types.ObjectId(adminID) })
      .populate('admissionFormId', 'firstName lastName admissionNo classId section')
      .populate('classId', 'name')
      .sort({ paymentDate: -1 })
      .lean();

    return sendResponse(res, 200, 'Fee collections fetched successfully', feeCollections, feeCollections.length);
  } catch (error) {
    console.error('Error fetching fee collections:', error.message, error.stack);
    return sendResponse(res, 500, `Server error while fetching fee collections: ${error.message}`);
  }
};

exports.addFeeCollection = async (req, res) => {
  try {
    const { admissionFormId, feeType, amount, dueDate, adminID } = sanitize(req.body);

    if (!admissionFormId || !feeType || !amount || !dueDate || !adminID) {
      return sendResponse(res, 400, 'Missing required fields: admissionFormId, feeType, amount, dueDate, adminID');
    }

    if (!mongoose.Types.ObjectId.isValid(adminID) || !mongoose.Types.ObjectId.isValid(admissionFormId)) {
      return sendResponse(res, 400, 'Invalid adminID or admissionFormId format');
    }

    if (isNaN(new Date(dueDate).getTime())) {
      return sendResponse(res, 400, 'Invalid date format for dueDate');
    }

    const admissionForm = await AdmissionForm.findById(admissionFormId).lean();
    if (!admissionForm || admissionForm.school.toString() !== adminID) {
      return sendResponse(res, 404, 'Admission form not found or not associated with this school');
    }

    const newFeeCollection = new FeeCollection({
      admissionFormId: new mongoose.Types.ObjectId(admissionFormId),
      studentName: `${admissionForm.firstName} ${admissionForm.lastName || ''}`.trim(),
      classId: admissionForm.classId,
      section: admissionForm.section,
      admissionNo: admissionForm.admissionNo,
      feeType,
      amount,
      dueDate: new Date(dueDate),
      status: 'Paid',
      school: new mongoose.Types.ObjectId(adminID),
    });

    await newFeeCollection.save();
    return sendResponse(res, 201, 'Fee collection added successfully', newFeeCollection);
  } catch (error) {
    console.error('Error adding fee collection:', error.stack);
    return sendResponse(res, 500, 'Server error while adding fee collection');
  }
};

exports.updateFeeCollection = async (req, res) => {
  try {
    const { feeType, amount, dueDate, status, adminID } = sanitize(req.body);

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return sendResponse(res, 400, 'Invalid adminID format');
    }

    if (dueDate && isNaN(new Date(dueDate).getTime())) {
      return sendResponse(res, 400, 'Invalid date format for dueDate');
    }

    const feeCollection = await FeeCollection.findOne({
      _id: req.params.id,
      school: new mongoose.Types.ObjectId(adminID),
    });

    if (!feeCollection) {
      return sendResponse(res, 404, 'Fee collection not found');
    }

    feeCollection.feeType = feeType ?? feeCollection.feeType;
    feeCollection.amount = amount ?? feeCollection.amount;
    feeCollection.dueDate = dueDate ? new Date(dueDate) : feeCollection.dueDate;
    feeCollection.status = status ?? feeCollection.status;

    await feeCollection.save();
    return sendResponse(res, 200, 'Fee collection updated successfully', feeCollection);
  } catch (error) {
    console.error('Error updating fee collection:', error.stack);
    return sendResponse(res, 500, 'Server error while updating fee collection');
  }
};

exports.deleteFeeCollection = async (req, res) => {
  try {
    const adminID = req.query.adminID;

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return sendResponse(res, 400, 'Invalid adminID format');
    }

    const feeCollection = await FeeCollection.findOneAndDelete({
      _id: req.params.id,
      school: new mongoose.Types.ObjectId(adminID),
    });

    if (!feeCollection) {
      return sendResponse(res, 404, 'Fee collection not found');
    }

    return sendResponse(res, 200, 'Fee collection deleted successfully');
  } catch (error) {
    console.error('Error deleting fee collection:', error.stack);
    return sendResponse(res, 500, 'Server error while deleting fee collection');
  }
};