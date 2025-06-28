const mongoose = require('mongoose');
const Discount = require('../models/discountModel');
const { sanitize } = require('express-mongo-sanitize');

const sendResponse = (res, status, message, data = null, count = null) => {
  const response = { message };
  if (data !== null) response.data = data;
  if (count !== null) response.count = count;
  return res.status(status).json(response);
};

exports.getDiscounts = async (req, res) => {
  try {
    const { adminID } = req.params;
    const { searchQuery } = req.query;

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return sendResponse(res, 400, 'Invalid adminID format');
    }

    const query = { school: new mongoose.Types.ObjectId(adminID) };

    if (searchQuery) {
      const searchRegex = new RegExp(sanitize(searchQuery), 'i');
      query.$or = [{ name: searchRegex }, { code: searchRegex }];
    }

    const discounts = await Discount.find(query).lean();

    const formattedDiscounts = discounts.map((d) => ({
      id: d._id.toString(),
      name: d.name,
      code: d.code,
      type: d.type,
      percentage: d.percentage || '',
      amount: d.amount || '',
      useCount: d.useCount || '',
      expiry: d.expiry ? d.expiry.toISOString().split('T')[0] : '',
      description: d.description || '',
    }));

    return sendResponse(res, 200, 'Discounts fetched successfully', formattedDiscounts, formattedDiscounts.length);
  } catch (error) {
    console.error('Error fetching discounts:', error.message, error.stack);
    return sendResponse(res, 500, `Server error while fetching discounts: ${error.message}`);
  }
};

exports.createDiscount = async (req, res) => {
  try {
    const { adminID } = req.params;
    const sanitizedData = sanitize(req.body);

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return sendResponse(res, 400, 'Invalid adminID format');
    }

    const { name, code, type, percentage, amount, useCount, expiry, description } = sanitizedData;

    if (!name || !code || !type) {
      return sendResponse(res, 400, 'Name, code, and type are required');
    }

    const discountData = {
      name,
      code: code.toUpperCase(),
      type,
      percentage: type === 'percentage' ? Number(percentage) : undefined,
      amount: type === 'amount' ? Number(amount) : undefined,
      useCount: useCount ? Number(useCount) : undefined,
      expiry: expiry ? new Date(expiry) : undefined,
      description,
      school: new mongoose.Types.ObjectId(adminID),
    };

    const discount = await Discount.create(discountData);

    const formattedDiscount = {
      id: discount._id.toString(),
      name: discount.name,
      code: discount.code,
      type: discount.type,
      percentage: discount.percentage || '',
      amount: discount.amount || '',
      useCount: discount.useCount || '',
      expiry: discount.expiry ? discount.expiry.toISOString().split('T')[0] : '',
      description: discount.description || '',
    };

    return sendResponse(res, 201, 'Discount created successfully', formattedDiscount);
  } catch (error) {
    console.error('Error creating discount:', error.message, error.stack);
    if (error.code === 11000) {
      return sendResponse(res, 400, 'Discount code already exists');
    }
    return sendResponse(res, 500, `Server error while creating discount: ${error.message}`);
  }
};

exports.updateDiscount = async (req, res) => {
  try {
    const { adminID, id } = req.params;
    const sanitizedData = sanitize(req.body);

    if (!mongoose.Types.ObjectId.isValid(adminID) || !mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, 'Invalid adminID or discount ID format');
    }

    const { name, code, type, percentage, amount, useCount, expiry, description } = sanitizedData;

    if (!name || !code || !type) {
      return sendResponse(res, 400, 'Name, code, and type are required');
    }

    const discountData = {
      name,
      code: code.toUpperCase(),
      type,
      percentage: type === 'percentage' ? (percentage ? Number(percentage) : null) : null,
      amount: type === 'amount' ? (amount ? Number(amount) : null) : null,
      useCount: useCount ? Number(useCount) : null,
      expiry: expiry ? new Date(expiry) : null,
      description: description || '',
    };

    // Remove null/undefined fields to prevent overwriting valid data
    Object.keys(discountData).forEach((key) => discountData[key] == null && delete discountData[key]);

    const discount = await Discount.findOneAndUpdate(
      { _id: id, school: new mongoose.Types.ObjectId(adminID) },
      { $set: discountData },
      { new: true, runValidators: true }
    ).lean();

    if (!discount) {
      return sendResponse(res, 404, 'Discount not found');
    }

    const formattedDiscount = {
      id: discount._id.toString(),
      name: discount.name,
      code: discount.code,
      type: discount.type,
      percentage: discount.percentage || '',
      amount: discount.amount || '',
      useCount: discount.useCount || '',
      expiry: discount.expiry ? discount.expiry.toISOString().split('T')[0] : '',
      description: discount.description || '',
    };

    return sendResponse(res, 200, 'Discount updated successfully', formattedDiscount);
  } catch (error) {
    console.error('Error updating discount:', error.message, error.stack);
    if (error.code === 11000) {
      return sendResponse(res, 400, 'Discount code already exists');
    }
    return sendResponse(res, 500, `Server error while updating discount: ${error.message}`);
  }
};

exports.deleteDiscount = async (req, res) => {
  try {
    const { adminID, id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(adminID) || !mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, 'Invalid adminID or discount ID format');
    }

    const discount = await Discount.findOneAndDelete({
      _id: id,
      school: new mongoose.Types.ObjectId(adminID),
    });

    if (!discount) {
      return sendResponse(res, 404, 'Discount not found');
    }

    return sendResponse(res, 200, 'Discount deleted successfully');
  } catch (error) {
    console.error('Error deleting discount:', error.message, error.stack);
    return sendResponse(res, 500, `Server error while deleting discount: ${error.message}`);
  }
};