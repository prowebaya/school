const mongoose = require('mongoose');
const FeeBalance = require('../models/feeBalanceModel');
const AdmissionForm = require('../models/student-addmission-model');
const { sanitize } = require('express-mongo-sanitize');

const sendResponse = (res, status, message, data = null, count = null) => {
  const response = { message };
  if (data !== null) response.data = data;
  if (count !== null) response.count = count;
  return res.status(status).json(response);
};

exports.getFeeBalances = async (req, res) => {
  try {
    const { adminID } = req.params;
    const { classId, section, searchQuery } = req.query;

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return sendResponse(res, 400, 'Invalid adminID format');
    }

    const query = { school: new mongoose.Types.ObjectId(adminID) };

    if (classId && mongoose.Types.ObjectId.isValid(classId)) {
      query.classId = new mongoose.Types.ObjectId(classId);
    }

    if (section) {
      query.section = section;
    }

    if (searchQuery) {
      const searchRegex = new RegExp(sanitize(searchQuery), 'i');
      query.$or = [
        { admissionNo: searchRegex },
        { rollNumber: searchRegex },
        { 'student.firstName': searchRegex },
        { 'student.lastName': searchRegex },
        { fatherName: searchRegex },
      ];
    }

    const feeBalances = await FeeBalance.find(query)
      .populate('student', 'firstName lastName')
      .populate('classId', 'name')
      .lean();

    const populatedBalances = feeBalances.map((balance) => ({
      id: balance._id.toString(),
      name: balance.student
        ? `${balance.student.firstName} ${balance.student.lastName || ''}`
        : 'Unknown',
      admissionNo: balance.admissionNo,
      admissionDate: balance.admissionDate.toISOString().split('T')[0],
      dueDate: balance.dueDate.toISOString().split('T')[0],
      rollNumber: balance.rollNumber,
      fatherName: balance.fatherName,
      balance: balance.balance,
      className: balance.classId?.name || 'Unknown',
      section: balance.section,
    }));

    return sendResponse(res, 200, 'Fee balances fetched successfully', populatedBalances, populatedBalances.length);
  } catch (error) {
    console.error('Error fetching fee balances:', error.message, error.stack);
    return sendResponse(res, 500, `Server error while fetching fee balances: ${error.message}`);
  }
};

exports.updateFeeBalances = async (req, res) => {
  try {
    const { adminID, balances } = sanitize(req.body);

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return sendResponse(res, 400, 'Invalid adminID format');
    }

    if (!Array.isArray(balances) || balances.length === 0) {
      return sendResponse(res, 400, 'Balances array is required and cannot be empty');
    }

    const updatedBalances = [];
    for (const { id, balance } of balances) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        continue; // Skip invalid IDs
      }
      if (typeof balance !== 'number' || balance < 0) {
        continue; // Skip invalid balances
      }

      const updatedBalance = await FeeBalance.findOneAndUpdate(
        { _id: id, school: new mongoose.Types.ObjectId(adminID) },
        { balance },
        { new: true }
      ).lean();

      if (updatedBalance) {
        updatedBalances.push(updatedBalance);
      }
    }

    return sendResponse(res, 200, 'Fee balances updated successfully', updatedBalances, updatedBalances.length);
  } catch (error) {
    console.error('Error updating fee balances:', error.message, error.stack);
    return sendResponse(res, 500, `Server error while updating fee balances: ${error.message}`);
  }
};