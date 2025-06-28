const mongoose = require('mongoose');
const Marksheet = require('../models/marksheet-model');

exports.getMarksheets = async (req, res) => {
  try {
    const adminID = req.params.adminID;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      console.error(`Invalid adminID format: ${adminID}`);
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    console.log(`Fetching marksheets for adminID: ${adminID}`);
    const marksheets = await Marksheet.find({ admin: new mongoose.Types.ObjectId(adminID) })
      .sort({ createdAt: -1 })
      .lean();
    console.log(`Found ${marksheets.length} marksheets for adminID: ${adminID}`);
    res.status(200).json({
      message: 'Marksheets fetched successfully',
      data: marksheets,
      count: marksheets.length,
    });
  } catch (error) {
    console.error('Error fetching marksheets:', error.message);
    res.status(500).json({ message: 'Server error while fetching marksheets', error: error.message });
  }
};

exports.addMarksheet = async (req, res) => {
  try {
    const {
      template,
      class: classField,
      section,
      studentName,
      examCenter,
      bodyText,
      footerText,
      printingDate,
      options,
      adminID,
      headerImage,
      leftLogo,
      rightLogo,
      leftSign,
      rightSign,
      backgroundImage,
    } = req.body;
    if (!template || !studentName || !examCenter || !adminID) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const existingMarksheet = await Marksheet.findOne({ template, admin: new mongoose.Types.ObjectId(adminID) });
    if (existingMarksheet) {
      return res.status(400).json({ message: 'Marksheet template already exists' });
    }
    const newMarksheet = new Marksheet({
      template,
      class: classField,
      section,
      studentName,
      examCenter,
      bodyText,
      footerText,
      printingDate,
      options: options || {
        name: false,
        fatherName: false,
        motherName: false,
        examSession: false,
        admissionNo: false,
        division: false,
        rank: false,
        rollNumber: false,
        photo: false,
        classSection: false,
        dob: false,
        remark: false,
      },
      admin: new mongoose.Types.ObjectId(adminID),
      headerImage: headerImage || null,
      leftLogo: leftLogo || null,
      rightLogo: rightLogo || null,
      leftSign: leftSign || null,
      rightSign: rightSign || null,
      backgroundImage: backgroundImage || null,
    });
    await newMarksheet.save();
    res.status(201).json({ message: 'Marksheet added successfully', data: newMarksheet });
  } catch (error) {
    console.error('Error adding marksheet:', error.message);
    res.status(500).json({ message: 'Server error while adding marksheet', error: error.message });
  }
};

exports.updateMarksheet = async (req, res) => {
  try {
    const {
      template,
      class: classField,
      section,
      studentName,
      examCenter,
      bodyText,
      footerText,
      printingDate,
      options,
      adminID,
      headerImage,
      leftLogo,
      rightLogo,
      leftSign,
      rightSign,
      backgroundImage,
    } = req.body;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const marksheet = await Marksheet.findOne({ _id: req.params.id, admin: new mongoose.Types.ObjectId(adminID) });
    if (!marksheet) {
      return res.status(404).json({ message: 'Marksheet not found' });
    }
    const existingMarksheet = await Marksheet.findOne({
      template,
      admin: new mongoose.Types.ObjectId(adminID),
      _id: { $ne: req.params.id },
    });
    if (existingMarksheet) {
      return res.status(400).json({ message: 'Marksheet template already exists' });
    }
    marksheet.template = template || marksheet.template;
    marksheet.class = classField || marksheet.class;
    marksheet.section = section || marksheet.section;
    marksheet.studentName = studentName || marksheet.studentName;
    marksheet.examCenter = examCenter || marksheet.examCenter;
    marksheet.bodyText = bodyText || marksheet.bodyText;
    marksheet.footerText = footerText || marksheet.footerText;
    marksheet.printingDate = printingDate || marksheet.printingDate;
    marksheet.options = options || marksheet.options;
    marksheet.headerImage = headerImage || marksheet.headerImage;
    marksheet.leftLogo = leftLogo || marksheet.leftLogo;
    marksheet.rightLogo = rightLogo || marksheet.rightLogo;
    marksheet.leftSign = leftSign || marksheet.leftSign;
    marksheet.rightSign = rightSign || marksheet.rightSign;
    marksheet.backgroundImage = backgroundImage || marksheet.backgroundImage;
    await marksheet.save();
    res.status(200).json({ message: 'Marksheet updated successfully', data: marksheet });
  } catch (error) {
    console.error('Error updating marksheet:', error.message);
    res.status(500).json({ message: 'Server error while updating marksheet', error: error.message });
  }
};

exports.deleteMarksheet = async (req, res) => {
  try {
    const adminID = req.query.adminID;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const marksheet = await Marksheet.findOneAndDelete({ _id: req.params.id, admin: new mongoose.Types.ObjectId(adminID) });
    if (!marksheet) {
      return res.status(404).json({ message: 'Marksheet not found' });
    }
    res.status(200).json({ message: 'Marksheet deleted successfully' });
  } catch (error) {
    console.error('Error deleting marksheet:', error.message);
    res.status(500).json({ message: 'Server error while deleting marksheet', error: error.message });
  }
};