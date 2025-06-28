const mongoose = require('mongoose');
const FeeCollection = require('../models/feeCollectionModel');
const FeeGroup = require('../models/feeGroupModel');
const Class = require('../models/fclass-model');
const { sanitize } = require('express-mongo-sanitize');

const sendResponse = (res, status, message, data = null, count = null) => {
  const response = { message };
  if (data !== null) response.data = data;
  if (count !== null) response.count = count;
  return res.status(status).json(response);
};

exports.searchDuesFees = async (req, res) => {
  try {
    const { adminID, feeGroupId, classId, section, searchQuery } = sanitize(req.query);

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return sendResponse(res, 400, 'Invalid adminID format');
    }

    const matchStage = {
      school: new mongoose.Types.ObjectId(adminID),
      balance: { $gt: 0 }, // Only include records with dues
    };

    if (feeGroupId && mongoose.Types.ObjectId.isValid(feeGroupId)) {
      matchStage.feeGroupId = new mongoose.Types.ObjectId(feeGroupId);
    }

    if (classId && mongoose.Types.ObjectId.isValid(classId)) {
      matchStage.classId = new mongoose.Types.ObjectId(classId);
    }

    if (section) {
      matchStage.section = section;
    }

    if (searchQuery) {
      matchStage.$or = [
        { studentName: { $regex: searchQuery, $options: 'i' } },
        { admissionNo: { $regex: searchQuery, $options: 'i' } },
      ];
    }

    const dues = await FeeCollection.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: 'feegroups',
          localField: 'feeGroupId',
          foreignField: '_id',
          as: 'feeGroup',
        },
      },
      { $unwind: { path: '$feeGroup', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'feetypes',
          localField: 'feeType',
          foreignField: '_id',
          as: 'feeType',
        },
      },
      { $unwind: { path: '$feeType', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'classes',
          localField: 'classId',
          foreignField: '_id',
          as: 'class',
        },
      },
      { $unwind: { path: '$class', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$admissionFormId',
          studentName: { $first: '$studentName' },
          admissionNo: { $first: '$admissionNo' },
          class: { $first: { name: '$class.name', section: '$section' } },
          feeGroups: { $push: '$feeGroup.name' },
          amount: { $sum: '$amount' },
          paid: { $sum: '$paid' },
          discount: { $sum: '$discount' },
          fine: { $sum: '$fine' },
          balance: { $sum: '$balance' },
        },
      },
      {
        $project: {
          class: { $concat: ['$class.name', '-', '$class.section'] },
          admissionNo: 1,
          studentName: 1,
          feeGroups: {
            $filter: {
              input: '$feeGroups',
              as: 'group',
              cond: { $ne: ['$$group', null] },
            },
          },
          amount: 1,
          paid: 1,
          discount: 1,
          fine: 1,
          balance: 1,
        },
      },
      { $sort: { studentName: 1 } },
    ]);

    return sendResponse(res, 200, 'Dues fees fetched successfully', dues, dues.length);
  } catch (error) {
    console.error('Error searching dues fees:', error.message, error.stack);
    return sendResponse(res, 500, `Server error while searching dues fees: ${error.message}`);
  }
};

exports.getDuesFeesOptions = async (req, res) => {
  try {
    const adminID = req.params.adminID;

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return sendResponse(res, 400, 'Invalid adminID format');
    }

    const [feeGroups, classes] = await Promise.all([
      FeeGroup.find({ school: adminID }, 'name').lean(),
      Class.find({ school: adminID }, 'name sections').lean(),
    ]);

    const sections = [...new Set(classes.flatMap(cls => cls.sections))].sort();

    return sendResponse(res, 200, 'Options fetched successfully', {
      feeGroups: [{ _id: 'all', name: 'Select All' }, ...feeGroups],
      classes,
      sections,
    });
  } catch (error) {
    console.error('Error fetching dues fees options:', error.message, error.stack);
    return sendResponse(res, 500, `Server error while fetching options: ${error.message}`);
  }
};