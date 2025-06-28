const mongoose = require('mongoose');
const OfflinePayment = require('../models/fflinePaymentModel');
const AdmissionForm = require('../models/student-addmission-model');
const { sanitize } = require('express-mongo-sanitize');

const sendResponse = (res, status, message, data = null, count = null) => {
  const response = { message };
  if (data !== null) response.data = data;
  if (count !== null) response.count = count;
  return res.status(status).json(response);
};

exports.getOfflinePayments = async (req, res) => {
  try {
    const adminID = req.params.adminID;

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return sendResponse(res, 400, 'Invalid adminID format');
    }

    const offlinePayments = await OfflinePayment.find({ school: new mongoose.Types.ObjectId(adminID) })
      .populate('admissionFormId', 'firstName lastName admissionNo classId section')
      .populate('classId', 'name')
      .sort({ submitDate: -1 })
      .lean();

    // Transform data to match frontend structure
    const transformedPayments = offlinePayments.map(payment => ({
      id: payment.requestId,
      admissionNo: payment.admissionNo,
      name: payment.studentName,
      class: payment.classId ? `${payment.classId.name} (${payment.section})` : payment.section,
      paymentDate: new Date(payment.paymentDate).toLocaleDateString('en-GB'),
      submitDate: new Date(payment.submitDate).toLocaleString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      amount: payment.amount,
      status: payment.status,
      paymentId: payment.paymentId,
    }));

    return sendResponse(res, 200, 'Offline payments fetched successfully', transformedPayments, transformedPayments.length);
  } catch (error) {
    console.error('Error fetching offline payments:', error.message, error.stack);
    return sendResponse(res, 500, `Server error while fetching offline payments: ${error.message}`);
  }
};

exports.addOfflinePayment = async (req, res) => {
  try {
    const {
      requestId,
      admissionFormId,
      admissionNo,
      studentName,
      classId,
      section,
      paymentDate,
      submitDate,
      amount,
      status,
      paymentId,
      adminID,
    } = sanitize(req.body);

    if (!requestId || !admissionFormId || !admissionNo || !studentName || !classId || !section || !paymentDate || !submitDate || !amount || !paymentId || !adminID) {
      return sendResponse(res, 400, 'Missing required fields');
    }

    if (!mongoose.Types.ObjectId.isValid(adminID) || !mongoose.Types.ObjectId.isValid(admissionFormId) || !mongoose.Types.ObjectId.isValid(classId)) {
      return sendResponse(res, 400, 'Invalid adminID, admissionFormId, or classId format');
    }

    if (isNaN(new Date(paymentDate).getTime()) || isNaN(new Date(submitDate).getTime())) {
      return sendResponse(res, 400, 'Invalid date format for paymentDate or submitDate');
    }

    const admissionForm = await AdmissionForm.findById(admissionFormId).lean();
    if (!admissionForm || admissionForm.school.toString() !== adminID) {
      return sendResponse(res, 404, 'Admission form not found or not associated with this school');
    }

    const newOfflinePayment = new OfflinePayment({
      requestId,
      admissionFormId: new mongoose.Types.ObjectId(admissionFormId),
      admissionNo,
      studentName,
      classId: new mongoose.Types.ObjectId(classId),
      section,
      paymentDate: new Date(paymentDate),
      submitDate: new Date(submitDate),
      amount,
      status: status || 'Pending',
      paymentId,
      school: new mongoose.Types.ObjectId(adminID),
    });

    await newOfflinePayment.save();
    return sendResponse(res, 201, 'Offline payment added successfully', newOfflinePayment);
  } catch (error) {
    console.error('Error adding offline payment:', error.stack);
    return sendResponse(res, 500, 'Server error while adding offline payment');
  }
};

exports.updateOfflinePayment = async (req, res) => {
  try {
    const { status, adminID } = sanitize(req.body);

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return sendResponse(res, 400, 'Invalid adminID format');
    }

    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return sendResponse(res, 400, 'Invalid status value');
    }

    const offlinePayment = await OfflinePayment.findOne({
      _id: req.params.id,
      school: new mongoose.Types.ObjectId(adminID),
    });

    if (!offlinePayment) {
      return sendResponse(res, 404, 'Offline payment not found');
    }

    offlinePayment.status = status;
    await offlinePayment.save();

    return sendResponse(res, 200, 'Offline payment updated successfully', offlinePayment);
  } catch (error) {
    console.error('Error updating offline payment:', error.stack);
    return sendResponse(res, 500, 'Server error while updating offline payment');
  }
};

exports.deleteOfflinePayment = async (req, res) => {
  try {
    const adminID = req.query.adminID;

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return sendResponse(res, 400, 'Invalid adminID format');
    }

    const offlinePayment = await OfflinePayment.findOneAndDelete({
      _id: req.params.id,
      school: new mongoose.Types.ObjectId(adminID),
    });

    if (!offlinePayment) {
      return sendResponse(res, 404, 'Offline payment not found');
    }

    return sendResponse(res, 200, 'Offline payment deleted successfully');
  } catch (error) {
    console.error('Error deleting offline payment:', error.stack);
    return sendResponse(res, 500, 'Server error while deleting offline payment');
  }
};