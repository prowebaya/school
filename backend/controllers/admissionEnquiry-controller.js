const mongoose = require('mongoose');
const AdmissionEnquiry = require('../models/admissionEnquiry-model');

exports.getAdmissionEnquiries = async (req, res) => {
  try {
    const adminID = req.params.adminID;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      console.error(`Invalid adminID format: ${adminID}`);
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    console.log(`Fetching admission enquiries for adminID: ${adminID}`);
    const enquiries = await AdmissionEnquiry.find({ school: new mongoose.Types.ObjectId(adminID) })
      .sort({ createdAt: -1 })
      .lean();
    console.log(`Found ${enquiries.length} admission enquiries for adminID: ${adminID}`);
    res.status(200).json({
      message: 'Admission enquiries fetched successfully',
      data: enquiries,
      count: enquiries.length,
    });
  } catch (error) {
    console.error('Error fetching admission enquiries:', error.message);
    res.status(500).json({ message: 'Server error while fetching admission enquiries', error: error.message });
  }
};

exports.addAdmissionEnquiry = async (req, res) => {
  try {
    const { name, phone, source, className, enquiryDate, lastFollowUp, nextFollowUp, status, adminID } = req.body;
    if (!name || !phone || !source || !className || !enquiryDate || !lastFollowUp || !nextFollowUp || !adminID) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const newEnquiry = new AdmissionEnquiry({
      name,
      phone,
      source,
      className,
      enquiryDate,
      lastFollowUp,
      nextFollowUp,
      status: status || 'Active',
      school: new mongoose.Types.ObjectId(adminID),
    });
    await newEnquiry.save();
    console.log('Added new admission enquiry:', newEnquiry);
    res.status(201).json({ message: 'Admission enquiry added successfully', data: newEnquiry });
  } catch (error) {
    console.error('Error adding admission enquiry:', error.message);
    res.status(500).json({ message: 'Server error while adding admission enquiry', error: error.message });
  }
};

exports.updateAdmissionEnquiry = async (req, res) => {
  try {
    const { name, phone, source, className, enquiryDate, lastFollowUp, nextFollowUp, status, adminID } = req.body;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const enquiry = await AdmissionEnquiry.findOne({ _id: req.params.id, school: new mongoose.Types.ObjectId(adminID) });
    if (!enquiry) {
      return res.status(404).json({ message: 'Admission enquiry not found' });
    }
    enquiry.name = name || enquiry.name;
    enquiry.phone = phone || enquiry.phone;
    enquiry.source = source || enquiry.source;
    enquiry.className = className || enquiry.className;
    enquiry.enquiryDate = enquiryDate || enquiry.enquiryDate;
    enquiry.lastFollowUp = lastFollowUp || enquiry.lastFollowUp;
    enquiry.nextFollowUp = nextFollowUp || enquiry.nextFollowUp;
    enquiry.status = status || enquiry.status;
    await enquiry.save();
    console.log('Updated admission enquiry:', enquiry);
    res.status(200).json({ message: 'Admission enquiry updated successfully', data: enquiry });
  } catch (error) {
    console.error('Error updating admission enquiry:', error.message);
    res.status(500).json({ message: 'Server error while updating admission enquiry', error: error.message });
  }
};

exports.deleteAdmissionEnquiry = async (req, res) => {
  try {
    const adminID = req.query.adminID;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const enquiry = await AdmissionEnquiry.findOneAndDelete({ _id: req.params.id, school: new mongoose.Types.ObjectId(adminID) });
    if (!enquiry) {
      return res.status(404).json({ message: 'Admission enquiry not found' });
    }
    console.log('Deleted admission enquiry:', enquiry);
    res.status(200).json({ message: 'Admission enquiry deleted successfully' });
  } catch (error) {
    console.error('Error deleting admission enquiry:', error.message);
    res.status(500).json({ message: 'Server error while deleting admission enquiry', error: error.message });
  }
};