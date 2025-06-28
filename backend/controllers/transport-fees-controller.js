const mongoose = require('mongoose');
const TransportFees = require('../models/transport-fees-model');

exports.getTransportFees = async (req, res) => {
  try {
    const adminID = req.params.adminID;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      console.error(`Invalid adminID format: ${adminID}`);
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    console.log(`Fetching transport fees for adminID: ${adminID}`);
    const fees = await TransportFees.find({ admin: new mongoose.Types.ObjectId(adminID) })
      .sort({ createdAt: -1 })
      .lean();
    console.log(`Found ${fees.length} transport fees for adminID: ${adminID}`);
    res.status(200).json({
      message: 'Transport fees fetched successfully',
      data: fees,
      count: fees.length,
    });
  } catch (error) {
    console.error('Error fetching transport fees:', error.message);
    res.status(500).json({ message: 'Server error while fetching transport fees', error: error.message });
  }
};

exports.addTransportFees = async (req, res) => {
  try {
    const { month, dueDate, fineType, percentage, fixedAmount, adminID } = req.body;
    if (!month || !dueDate || !fineType || !adminID) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const existingFees = await TransportFees.findOne({
      month,
      admin: new mongoose.Types.ObjectId(adminID),
    });
    if (existingFees) {
      return res.status(400).json({ message: 'Transport fees for this month already exist' });
    }
    const newFees = new TransportFees({
      month,
      dueDate,
      fineType,
      percentage: fineType === 'Percentage' ? percentage || '0.00' : '',
      fixedAmount: fineType === 'Fix Amount' ? fixedAmount || '0.00' : '',
      admin: new mongoose.Types.ObjectId(adminID),
    });
    await newFees.save();
    res.status(201).json({ message: 'Transport fees added successfully', data: newFees });
  } catch (error) {
    console.error('Error adding transport fees:', error.message);
    res.status(500).json({ message: 'Server error while adding transport fees', error: error.message });
  }
};

exports.updateTransportFees = async (req, res) => {
  try {
    const { month, dueDate, fineType, percentage, fixedAmount, adminID } = req.body;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const fees = await TransportFees.findOne({
      _id: req.params.id,
      admin: new mongoose.Types.ObjectId(adminID),
    });
    if (!fees) {
      return res.status(404).json({ message: 'Transport fees not found' });
    }
    const existingFees = await TransportFees.findOne({
      month,
      admin: new mongoose.Types.ObjectId(adminID),
      _id: { $ne: req.params.id },
    });
    if (existingFees) {
      return res.status(400).json({ message: 'Transport fees for this month already exist' });
    }
    fees.month = month || fees.month;
    fees.dueDate = dueDate || fees.dueDate;
    fees.fineType = fineType || fees.fineType;
    fees.percentage = fineType === 'Percentage' ? percentage || '0.00' : '';
    fees.fixedAmount = fineType === 'Fix Amount' ? fixedAmount || '0.00' : '';
    await fees.save();
    res.status(200).json({ message: 'Transport fees updated successfully', data: fees });
  } catch (error) {
    console.error('Error updating transport fees:', error.message);
    res.status(500).json({ message: 'Server error while updating transport fees', error: error.message });
  }
};

exports.deleteTransportFees = async (req, res) => {
  try {
    const adminID = req.query.adminID;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const fees = await TransportFees.findOneAndDelete({
      _id: req.params.id,
      admin: new mongoose.Types.ObjectId(adminID),
    });
    if (!fees) {
      return res.status(404).json({ message: 'Transport fees not found' });
    }
    res.status(200).json({ message: 'Transport fees deleted successfully' });
  } catch (error) {
    console.error('Error deleting transport fees:', error.message);
    res.status(500).json({ message: 'Server error while deleting transport fees', error: error.message });
  }
};

exports.copyTransportFees = async (req, res) => {
  try {
    const { adminID } = req.body;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const firstFees = await TransportFees.findOne({
      admin: new mongoose.Types.ObjectId(adminID),
    }).sort({ createdAt: 1 });
    if (!firstFees) {
      return res.status(404).json({ message: 'No transport fees found to copy' });
    }
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const bulkOps = months.map((month) => ({
      updateOne: {
        filter: { month, admin: new mongoose.Types.ObjectId(adminID) },
        update: {
          $set: {
            dueDate: firstFees.dueDate,
            fineType: firstFees.fineType,
            percentage: firstFees.percentage,
            fixedAmount: firstFees.fixedAmount,
            admin: new mongoose.Types.ObjectId(adminID),
          },
        },
        upsert: true,
      },
    }));
    await TransportFees.bulkWrite(bulkOps);
    res.status(200).json({ message: 'Transport fees copied successfully for all months' });
  } catch (error) {
    console.error('Error copying transport fees:', error.message);
    res.status(500).json({ message: 'Server error while copying transport fees', error: error.message });
  }
};