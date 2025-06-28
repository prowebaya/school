const mongoose = require('mongoose');
const FeeCollection = require('../models/feeCollectionModel');
const AdmissionHub = require('../models/admissionHubModel.js'); // Updated reference
const Class = require('../models/fclass-model');
const FeeGroup = require('../models/feeGroupModel');
const FeeType = require('../models/feeTypeModel');
const { sanitize } = require('express-mongo-sanitize');

const sendResponse = (res, status, message, data = null, count = null) => {
  const response = { message };
  if (data !== null) response.data = data;
  if (count !== null) response.count = count;
  return res.status(status).json(response);
};

exports.generateInstallmentPlan = async (req, res) => {
  try {
    const {
      classId,
      section,
      studentId,
      totalFees,
      firstInstallment,
      balanceFees,
      installments,
      dueDateDay,
      fineType,
      fineValue,
      adminID,
    } = sanitize(req.body);

    // Validate required fields
    if (!classId || !section || !studentId || !totalFees || !balanceFees || !installments || !dueDateDay || !adminID) {
      return sendResponse(res, 400, 'Missing required fields');
    }

    if (!mongoose.Types.ObjectId.isValid(adminID) || !mongoose.Types.ObjectId.isValid(classId) || !mongoose.Types.ObjectId.isValid(studentId)) {
      return sendResponse(res, 400, 'Invalid ID format for adminID, classId, or studentId');
    }

    // Validate student, class, and section
    const [student, classDoc] = await Promise.all([
      AdmissionHub.findOne({ _id: studentId, school: adminID, classId, section }), // Updated model
      Class.findOne({ _id: classId, school: adminID, sections: section }),
    ]);

    if (!student) {
      return sendResponse(res, 404, 'Student not found or does not match class/section');
    }

    if (!classDoc) {
      return sendResponse(res, 404, 'Class or section not found');
    }

    // Validate numeric fields
    const totalFeesNum = parseFloat(totalFees);
    const firstInstallmentNum = parseFloat(firstInstallment) || 0;
    const balanceFeesNum = parseFloat(balanceFees);
    const installmentsNum = parseInt(installments);
    const dueDateDayNum = parseInt(dueDateDay);
    const fineValueNum = parseFloat(fineValue) || 0;

    if (totalFeesNum < 0 || firstInstallmentNum < 0 || balanceFeesNum < 0 || installmentsNum < 1 || dueDateDayNum < 1 || dueDateDayNum > 31 || fineValueNum < 0) {
      return sendResponse(res, 400, 'Invalid numeric values');
    }

    if (fineType !== 'Fix Amount' && fineType !== 'Percentage') {
      return sendResponse(res, 400, 'Invalid fine type');
    }

    // Validate fees consistency
    if (totalFeesNum !== firstInstallmentNum + balanceFeesNum) {
      return sendResponse(res, 400, 'Total fees must equal first installment plus balance fees');
    }

    // Find or create a default FeeGroup and FeeType for quick fees
    let [feeGroup, feeType] = await Promise.all([
      FeeGroup.findOne({ name: 'Quick Fees', school: adminID }),
      FeeType.findOne({ name: 'Quick Installment', school: adminID }),
    ]);

    if (!feeGroup) {
      feeGroup = await FeeGroup.create({ name: 'Quick Fees', school: adminID });
    }

    if (!feeType) {
      feeType = await FeeType.create({ name: 'Quick Installment', code: 'QF-001', school: adminID });
    }

    // Calculate installment amounts
    const remainingInstallments = installmentsNum - (firstInstallmentNum > 0 ? 1 : 0);
    const installmentAmount = remainingInstallments > 0 ? balanceFeesNum / remainingInstallments : 0;

    // Generate installment records
    const feeCollections = [];
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    if (firstInstallmentNum > 0) {
      const dueDate = new Date(currentYear, currentMonth, dueDateDayNum);
      feeCollections.push({
        admissionFormId: studentId,
        studentName: student.studentName,
        classId,
        section,
        admissionNo: student.admissionNo,
        feeType: feeType._id,
        feeGroupId: feeGroup._id,
        amount: firstInstallmentNum,
        balance: firstInstallmentNum,
        dueDate,
        fine: fineType === 'Percentage' ? (fineValueNum / 100) * firstInstallmentNum : fineValueNum,
        installmentNumber: 1,
        school: new mongoose.Types.ObjectId(adminID),
      });
      currentMonth = (currentMonth + 1) % 12;
      if (currentMonth === 0) currentYear += 1;
    }

    for (let i = 1; i <= remainingInstallments; i++) {
      const dueDate = new Date(currentYear, currentMonth, dueDateDayNum);
      feeCollections.push({
        admissionFormId: studentId,
        studentName: student.studentName,
        classId,
        section,
        admissionNo: student.admissionNo,
        feeType: feeType._id,
        feeGroupId: feeGroup._id,
        amount: installmentAmount,
        balance: installmentAmount,
        dueDate,
        fine: fineType === 'Percentage' ? (fineValueNum / 100) * installmentAmount : fineValueNum,
        installmentNumber: firstInstallmentNum > 0 ? i + 1 : i,
        school: new mongoose.Types.ObjectId(adminID),
      });
      currentMonth = (currentMonth + 1) % 12;
      if (currentMonth === 0) currentYear += 1;
    }

    // Save all fee collections
    const savedCollections = await FeeCollection.insertMany(feeCollections);

    return sendResponse(res, 201, 'Installment plan generated successfully', savedCollections, savedCollections.length);
  } catch (error) {
    console.error('Error generating installment plan:', error.message, error.stack);
    if (error.code === 11000) {
      return sendResponse(res, 400, 'Duplicate fee collection detected');
    }
    return sendResponse(res, 500, `Server error while generating installment plan: ${error.message}`);
  }
};

exports.getQuickFeesOptions = async (req, res) => {
  try {
    const adminID = req.params.adminID;

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return sendResponse(res, 400, 'Invalid adminID format');
    }

    const [classes, students] = await Promise.all([
      Class.find({ school: adminID }, 'name sections').lean(),
      AdmissionHub.find({ school: adminID }, '_id studentName admissionNo classId section').lean(), // Updated model
    ]);

    const sections = [...new Set(classes.flatMap(cls => cls.sections))].sort();

    return sendResponse(res, 200, 'Options fetched successfully', {
      classes,
      sections,
      students: students.map(student => ({
        _id: student._id,
        name: `${student.studentName} (${student.admissionNo})`,
        classId: student.classId,
        section: student.section,
      })),
    });
  } catch (error) {
    console.error('Error fetching quick fees options:', error.message, error.stack);
    return sendResponse(res, 500, `Server error while fetching options: ${error.message}`);
  }
};