const mongoose = require('mongoose');
const Complaint = require('../models/complaintSchema');
const { sanitize } = require('express-mongo-sanitize'); // Add this dependency

// Helper function to standardize responses
const sendResponse = (res, status, message, data = null, count = null) => {
  const response = { message };
  if (data !== null) response.data = data;
  if (count !== null) response.count = count;
  return res.status(status).json(response);
};

exports.getComplaints = async (req, res) => {
  try {
    const adminID = req.params.adminID;

    // Validate adminID format
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return sendResponse(res, 400, 'Invalid adminID format');
    }

    // Fetch complaints with explicit school filter
    const complaints = await Complaint.find({ school: new mongoose.Types.ObjectId(adminID) })
      .sort({ createdAt: -1 })
      .lean();

    return sendResponse(res, 200, 'Complaints fetched successfully', complaints, complaints.length);
  } catch (error) {
    console.error('Error fetching complaints:', error.stack);
    return sendResponse(res, 500, 'Server error while fetching complaints', null, null);
  }
};

exports.addComplaint = async (req, res) => {
  try {
    const {
      complaintType,
      source,
      complainantType,
      date,
      description,
      actionTaken,
      note,
      name,
      phone,
      adminID,
    } = sanitize(req.body); // Sanitize input

    // Validate required fields
    if (!complaintType || !complainantType || !date || !adminID) {
      return sendResponse(res, 400, 'Missing required fields: complaintType, complainantType, date, adminID');
    }

    // Validate adminID format
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return sendResponse(res, 400, 'Invalid adminID format');
    }

    // Validate date
    if (isNaN(new Date(date).getTime())) {
      return sendResponse(res, 400, 'Invalid date format');
    }

    const newComplaint = new Complaint({
      complaintType,
      source,
      complainantType,
      date: new Date(date),
      description,
      actionTaken: actionTaken || 'Pending',
      note,
      name,
      phone,
      school: new mongoose.Types.ObjectId(adminID),
    });

    await newComplaint.save();
    return sendResponse(res, 201, 'Complaint added successfully', newComplaint);
  } catch (error) {
    console.error('Error adding complaint:', error.stack);
    return sendResponse(res, 500, 'Server error while adding complaint');
  }
};

exports.updateComplaint = async (req, res) => {
  try {
    const {
      complaintType,
      source,
      complainantType,
      date,
      description,
      actionTaken,
      note,
      name,
      phone,
      adminID,
    } = sanitize(req.body); // Sanitize input

    // Validate adminID format
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return sendResponse(res, 400, 'Invalid adminID format');
    }

    // Validate date if provided
    if (date && isNaN(new Date(date).getTime())) {
      return sendResponse(res, 400, 'Invalid date format');
    }

    const complaint = await Complaint.findOne({ _id: req.params.id, school: new mongoose.Types.ObjectId(adminID) });
    if (!complaint) {
      return sendResponse(res, 404, 'Complaint not found');
    }

    // Update fields only if provided
    complaint.complaintType = complaintType ?? complaint.complaintType;
    complaint.source = source ?? complaint.source;
    complaint.complainantType = complainantType ?? complaint.complaintType;
    complaint.date = date ? new Date(date) : complaint.date;
    complaint.description = description ?? complaint.description;
    complaint.actionTaken = actionTaken ?? complaint.actionTaken;
    complaint.note = note ?? complaint.note;
    complaint.name = name ?? complaint.name;
    complaint.phone = phone ?? complaint.phone;

    await complaint.save();
    return sendResponse(res, 200, 'Complaint updated successfully', complaint);
  } catch (error) {
    console.error('Error updating complaint:', error.stack);
    return sendResponse(res, 500, 'Server error while updating complaint');
  }
};

exports.deleteComplaint = async (req, res) => {
  try {
    const adminID = req.query.adminID;

    // Validate adminID format
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return sendResponse(res, 400, 'Invalid adminID format');
    }

    const complaint = await Complaint.findOneAndDelete({
      _id: req.params.id,
      school: new mongoose.Types.ObjectId(adminID),
    });

    if (!complaint) {
      return sendResponse(res, 404, 'Complaint not found');
    }

    return sendResponse(res, 200, 'Complaint deleted successfully');
  } catch (error) {
    console.error('Error deleting complaint:', error.stack);
    return sendResponse(res, 500, 'Server error while deleting complaint');
  }
};