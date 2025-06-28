const mongoose = require('mongoose');
const AddTransportFee = require('../models/add-transport-fee-model.js');
const AdmissionForm = require('../models/admissionHubModel.js'); // Assuming this model exists for StudentAdmissionForm

// Fetch all transport fees for a given admin
exports.getAddTransportFees = async (req, res) => {
  try {
    const adminID = req.params.adminID;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      console.error(`Invalid adminID format: ${adminID}`);
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    console.log(`Fetching transport fees for adminID: ${adminID}`);
    const transportFees = await AddTransportFee.find({ admin: new mongoose.Types.ObjectId(adminID) })
      .sort({ createdAt: -1 })
      .lean();
    console.log(`Found ${transportFees.length} transport fees for adminID: ${adminID}`);
    res.status(200).json({
      message: 'Transport fees fetched successfully',
      data: transportFees,
      count: transportFees.length,
    });
  } catch (error) {
    console.error('Error fetching transport fees:', error.message);
    res.status(500).json({ message: 'Server error while fetching transport fees', error: error.message });
  }
};

// Add a new transport fee
exports.addAddTransportFee = async (req, res) => {
  try {
    const { admissionNo, studentName, class: className, fatherName, dob, route, vehicleNo, pickupPoint, feeAmount, dueDate, adminID } = req.body;
    if (!admissionNo || !studentName || !className || !fatherName || !dob || !route || !vehicleNo || !pickupPoint || !feeAmount || !dueDate || !adminID) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const existingFee = await AddTransportFee.findOne({ admissionNo, admin: new mongoose.Types.ObjectId(adminID) });
    if (existingFee) {
      return res.status(400).json({ message: 'Transport fee for this admission number already exists' });
    }
    const newTransportFee = new AddTransportFee({
      admissionNo,
      studentName,
      class: className,
      fatherName,
      dob,
      route,
      vehicleNo,
      pickupPoint,
      feeAmount,
      dueDate,
      admin: new mongoose.Types.ObjectId(adminID),
    });
    await newTransportFee.save();
    res.status(201).json({ message: 'Transport fee added successfully', data: newTransportFee });
  } catch (error) {
    console.error('Error adding transport fee:', error.message);
    res.status(500).json({ message: 'Server error while adding transport fee', error: error.message });
  }
};

// Update an existing transport fee
exports.updateAddTransportFee = async (req, res) => {
  try {
    const { admissionNo, studentName, class: className, fatherName, dob, route, vehicleNo, pickupPoint, feeAmount, dueDate, adminID } = req.body;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const transportFee = await AddTransportFee.findOne({ _id: req.params.id, admin: new mongoose.Types.ObjectId(adminID) });
    if (!transportFee) {
      return res.status(404).json({ message: 'Transport fee not found' });
    }
    const existingFee = await AddTransportFee.findOne({
      admissionNo,
      admin: new mongoose.Types.ObjectId(adminID),
      _id: { $ne: req.params.id },
    });
    if (existingFee) {
      return res.status(400).json({ message: 'Transport fee for this admission number already exists' });
    }
    transportFee.admissionNo = admissionNo || transportFee.admissionNo;
    transportFee.studentName = studentName || transportFee.studentName;
    transportFee.class = className || transportFee.class;
    transportFee.fatherName = fatherName || transportFee.fatherName;
    transportFee.dob = dob || transportFee.dob;
    transportFee.route = route || transportFee.route;
    transportFee.vehicleNo = vehicleNo || transportFee.vehicleNo;
    transportFee.pickupPoint = pickupPoint || transportFee.pickupPoint;
    transportFee.feeAmount = feeAmount || transportFee.feeAmount;
    transportFee.dueDate = dueDate || transportFee.dueDate;
    await transportFee.save();
    res.status(200).json({ message: 'Transport fee updated successfully', data: transportFee });
  } catch (error) {
    console.error('Error updating transport fee:', error.message);
    res.status(500).json({ message: 'Server error while updating transport fee', error: error.message });
  }
};

// Delete a transport fee
// Delete a transport fee
exports.deleteAddTransportFee = async (req, res) => {
  try {
    const adminID = req.query.adminID;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const transportFee = await AddTransportFee.findOneAndDelete({
      _id: req.params.id,
      admin: new mongoose.Types.ObjectId(adminID),
    });
    if (!transportFee) {
      return res.status(404).json({ message: 'Transport fee not found' });
    }
    res.status(200).json({ message: 'Transport fee deleted successfully' });
  } catch (error) {
    console.error('Error deleting transport fee:', error.message);
    res.status(500).json({ message: 'Server error while deleting transport fee', error: error.message });
  }
};