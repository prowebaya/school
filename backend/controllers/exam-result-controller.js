const mongoose = require('mongoose');
const ExamResult = require('../models/exam-result-model');

exports.getExamResults = async (req, res) => {
  try {
    const adminID = req.params.adminID;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      console.error(`Invalid adminID format: ${adminID}`);
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    console.log(`Fetching exam results for adminID: ${adminID}`);
    const examResults = await ExamResult.find({ admin: new mongoose.Types.ObjectId(adminID) })
      .populate('classId', 'name')
      .sort({ createdAt: -1 })
      .lean();
    console.log(`Found ${examResults.length} exam results for adminID: ${adminID}`);
    res.status(200).json({
      message: 'Exam results fetched successfully',
      data: examResults,
      count: examResults.length,
    });
  } catch (error) {
    console.error('Error fetching exam results:', error.message);
    res.status(500).json({ message: 'Server error while fetching exam results', error: error.message });
  }
};

exports.addExamResult = async (req, res) => {
  try {
    const { admissionNo, rollNo, studentName, examGroup, examType, session, classId, section, subjects, adminID } = req.body;
    if (!admissionNo || !rollNo || !studentName || !examGroup || !examType || !session || !classId || !section || !subjects || !adminID) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!mongoose.Types.ObjectId.isValid(adminID) || !mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(400).json({ message: 'Invalid adminID or classId format' });
    }
    const existingResult = await ExamResult.findOne({
      admissionNo,
      examType,
      session,
      classId: new mongoose.Types.ObjectId(classId),
      admin: new mongoose.Types.ObjectId(adminID),
    });
    if (existingResult) {
      return res.status(400).json({ message: 'Exam result already exists for this admission number, exam type, and session' });
    }

    // Calculate grand total, percentage, and result
    const grandTotal = subjects.reduce((sum, sub) => sum + sub.marksObtained, 0);
    const totalMaxMarks = subjects.length * 100; // Assuming max marks is 100 per subject
    const percent = (grandTotal / totalMaxMarks) * 100;
    const result = percent >= 33 ? 'Pass' : 'Fail'; // Example passing criteria

    // Determine rank (simplified: rank based on percentage within same class, section, exam type, session)
    const sameGroupResults = await ExamResult.find({
      classId: new mongoose.Types.ObjectId(classId),
      section,
      examType,
      session,
      admin: new mongoose.Types.ObjectId(adminID),
    }).lean();
    const allPercentages = [...sameGroupResults.map(r => r.percent), percent].sort((a, b) => b - a);
    const rank = allPercentages.indexOf(percent) + 1;

    const newExamResult = new ExamResult({
      admissionNo,
      rollNo,
      studentName,
      examGroup,
      examType,
      session,
      classId: new mongoose.Types.ObjectId(classId),
      section,
      subjects,
      grandTotal,
      percent,
      rank,
      result,
      admin: new mongoose.Types.ObjectId(adminID),
    });

    await newExamResult.save();
    res.status(201).json({ message: 'Exam result added successfully', data: newExamResult });
  } catch (error) {
    console.error('Error adding exam result:', error.message);
    res.status(500).json({ message: 'Server error while adding exam result', error: error.message });
  }
};

exports.updateExamResult = async (req, res) => {
  try {
    const { admissionNo, rollNo, studentName, examGroup, examType, session, classId, section, subjects, adminID } = req.body;
    if (!mongoose.Types.ObjectId.isValid(adminID) || !mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(400).json({ message: 'Invalid adminID or classId format' });
    }
    const examResult = await ExamResult.findOne({
      _id: req.params.id,
      admin: new mongoose.Types.ObjectId(adminID),
    });
    if (!examResult) {
      return res.status(404).json({ message: 'Exam result not found' });
    }

    // Calculate grand total, percentage, and result
    const grandTotal = subjects.reduce((sum, sub) => sum + sub.marksObtained, 0);
    const totalMaxMarks = subjects.length * 100;
    const percent = (grandTotal / totalMaxMarks) * 100;
    const result = percent >= 33 ? 'Pass' : 'Fail';

    // Update rank
    const sameGroupResults = await ExamResult.find({
      classId: new mongoose.Types.ObjectId(classId),
      section,
      examType,
      session,
      admin: new mongoose.Types.ObjectId(adminID),
      _id: { $ne: req.params.id },
    }).lean();
    const allPercentages = [...sameGroupResults.map(r => r.percent), percent].sort((a, b) => b - a);
    const rank = allPercentages.indexOf(percent) + 1;

    examResult.admissionNo = admissionNo || examResult.admissionNo;
    examResult.rollNo = rollNo || examResult.rollNo;
    examResult.studentName = studentName || examResult.studentName;
    examResult.examGroup = examGroup || examResult.examGroup;
    examResult.examType = examType || examResult.examType;
    examResult.session = session || examResult.session;
    examResult.classId = classId ? new mongoose.Types.ObjectId(classId) : examResult.classId;
    examResult.section = section || examResult.section;
    examResult.subjects = subjects || examResult.subjects;
    examResult.grandTotal = grandTotal;
    examResult.percent = percent;
    examResult.rank = rank;
    examResult.result = result;

    await examResult.save();
    res.status(200).json({ message: 'Exam result updated successfully', data: examResult });
  } catch (error) {
    console.error('Error updating exam result:', error.message);
    res.status(500).json({ message: 'Server error while updating exam result', error: error.message });
  }
};

exports.deleteExamResult = async (req, res) => {
  try {
    const adminID = req.query.adminID;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const examResult = await ExamResult.findOneAndDelete({
      _id: req.params.id,
      admin: new mongoose.Types.ObjectId(adminID),
    });
    if (!examResult) {
      return res.status(404).json({ message: 'Exam result not found' });
    }
    res.status(200).json({ message: 'Exam result deleted successfully' });
  } catch (error) {
    console.error('Error deleting exam result:', error.message);
    res.status(500).json({ message: 'Server error while deleting exam result', error: error.message });
  }
};