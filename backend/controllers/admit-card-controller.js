const mongoose = require('mongoose');
const AdmitCard = require('../models/admit-card-model');

exports.getAdmitCards = async (req, res) => {
  try {
    const adminID = req.params.adminID;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      console.error(`Invalid adminID format: ${adminID}`);
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    console.log(`Fetching admit cards for adminID: ${adminID}`);
    const admitCards = await AdmitCard.find({ admin: new mongoose.Types.ObjectId(adminID) })
      .sort({ createdAt: -1 })
      .lean();
    console.log(`Found ${admitCards.length} admit cards for adminID: ${adminID}`);
    res.status(200).json({
      message: 'Admit cards fetched successfully',
      data: admitCards,
      count: admitCards.length,
    });
  } catch (error) {
    console.error('Error fetching admit cards:', error.message);
    res.status(500).json({ message: 'Server error while fetching admit cards', error: error.message });
  }
};

exports.addAdmitCard = async (req, res) => {
  try {
    const { template, studentName, examName, examDate, examCenter, footerText, printingDate, subjects, options, adminID } = req.body;
    if (!template || !studentName || !examName || !examDate || !examCenter || !adminID) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const existingCard = await AdmitCard.findOne({ template, admin: new mongoose.Types.ObjectId(adminID) });
    if (existingCard) {
      return res.status(400).json({ message: 'Admit card template already exists' });
    }
    const newAdmitCard = new AdmitCard({
      template,
      studentName,
      examName,
      examDate,
      examCenter,
      footerText,
      printingDate,
      subjects: subjects || [{ subject: '', date: '' }],
      options: options || {
        name: true,
        fatherName: false,
        motherName: false,
        admissionNo: true,
        rollNumber: true,
        dob: false,
        gender: false,
        photo: false,
      },
      admin: new mongoose.Types.ObjectId(adminID),
      leftLogo: req.body.leftLogo || null,
      rightLogo: req.body.rightLogo || null,
      sign: req.body.sign || null,
      backgroundImage: req.body.backgroundImage || null,
    });
    await newAdmitCard.save();
    res.status(201).json({ message: 'Admit card added successfully', data: newAdmitCard });
  } catch (error) {
    console.error('Error adding admit card:', error.message);
    res.status(500).json({ message: 'Server error while adding admit card', error: error.message });
  }
};

exports.updateAdmitCard = async (req, res) => {
  try {
    const { template, studentName, examName, examDate, examCenter, footerText, printingDate, subjects, options, adminID } = req.body;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const admitCard = await AdmitCard.findOne({ _id: req.params.id, admin: new mongoose.Types.ObjectId(adminID) });
    if (!admitCard) {
      return res.status(404).json({ message: 'Admit card not found' });
    }
    const existingCard = await AdmitCard.findOne({ template, admin: new mongoose.Types.ObjectId(adminID), _id: { $ne: req.params.id } });
    if (existingCard) {
      return res.status(400).json({ message: 'Admit card template already exists' });
    }
    admitCard.template = template || admitCard.template;
    admitCard.studentName = studentName || admitCard.studentName;
    admitCard.examName = examName || admitCard.examName;
    admitCard.examDate = examDate || admitCard.examDate;
    admitCard.examCenter = examCenter || admitCard.examCenter;
    admitCard.footerText = footerText || admitCard.footerText;
    admitCard.printingDate = printingDate || admitCard.printingDate;
    admitCard.subjects = subjects || admitCard.subjects;
    admitCard.options = options || admitCard.options;
    admitCard.leftLogo = req.body.leftLogo || admitCard.leftLogo;
    admitCard.rightLogo = req.body.rightLogo || admitCard.rightLogo;
    admitCard.sign = req.body.sign || admitCard.sign;
    admitCard.backgroundImage = req.body.backgroundImage || admitCard.backgroundImage;
    await admitCard.save();
    res.status(200).json({ message: 'Admit card updated successfully', data: admitCard });
  } catch (error) {
    console.error('Error updating admit card:', error.message);
    res.status(500).json({ message: 'Server error while updating admit card', error: error.message });
  }
};

exports.deleteAdmitCard = async (req, res) => {
  try {
    const adminID = req.query.adminID;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const admitCard = await AdmitCard.findOneAndDelete({ _id: req.params.id, admin: new mongoose.Types.ObjectId(adminID) });
    if (!admitCard) {
      return res.status(404).json({ message: 'Admit card not found' });
    }
    res.status(200).json({ message: 'Admit card deleted successfully' });
  } catch (error) {
    console.error('Error deleting admit card:', error.message);
    res.status(500).json({ message: 'Server error while deleting admit card', error: error.message });
  }
};