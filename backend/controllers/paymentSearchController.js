const mongoose = require('mongoose');
const FeeCollection = require('../models/feeCollectionModel');
const OfflinePayment = require('../models/fflinePaymentModel');
const { sanitize } = require('express-mongo-sanitize');

const sendResponse = (res, status, message, data = null) => {
  const response = { message };
  if (data !== null) response.data = data;
  return res.status(status).json(response);
};

exports.searchPayments = async (req, res) => {
  try {
    const { paymentId, adminID } = sanitize(req.query);

    if (!paymentId || !adminID) {
      return sendResponse(res, 400, 'Missing required query parameters: paymentId and adminID');
    }

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return sendResponse(res, 400, 'Invalid adminID format');
    }

    // Search in OfflinePayment collection
    const offlinePayment = await OfflinePayment.findOne({
      paymentId,
      school: new mongoose.Types.ObjectId(adminID),
    })
      .populate('admissionFormId', 'firstName lastName admissionNo classId section')
      .populate('classId', 'name')
      .lean();

    // Search in FeeCollection collection (optional, assuming paymentId might be added later)
    const feeCollection = await FeeCollection.findOne({
      paymentId: paymentId || undefined, // Handle cases where paymentId is not in FeeCollection
      school: new mongoose.Types.ObjectId(adminID),
    })
      .populate('admissionFormId', 'firstName lastName admissionNo classId section')
      .populate('classId', 'name')
      .lean();

    const results = [];

    if (offlinePayment) {
      results.push({
        type: 'OfflinePayment',
        id: offlinePayment.requestId,
        paymentId: offlinePayment.paymentId,
        admissionNo: offlinePayment.admissionNo,
        studentName: offlinePayment.studentName,
        class: offlinePayment.classId ? `${offlinePayment.classId.name} (${offlinePayment.section})` : offlinePayment.section,
        amount: offlinePayment.amount,
        paymentDate: new Date(offlinePayment.paymentDate).toLocaleDateString('en-GB'),
        submitDate: offlinePayment.submitDate ? new Date(offlinePayment.submitDate).toLocaleString('en-US', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }) : null,
        status: offlinePayment.status,
      });
    }

    if (feeCollection) {
      results.push({
        type: 'FeeCollection',
        id: feeCollection._id,
        paymentId: feeCollection.paymentId || 'N/A',
        admissionNo: feeCollection.admissionNo,
        studentName: feeCollection.studentName,
        class: feeCollection.classId ? `${feeCollection.classId.name} (${feeCollection.section})` : feeCollection.section,
        amount: feeCollection.amount,
        paymentDate: new Date(feeCollection.paymentDate).toLocaleDateString('en-GB'),
        dueDate: new Date(feeCollection.dueDate).toLocaleDateString('en-GB'),
        status: feeCollection.status,
        feeType: feeCollection.feeType,
      });
    }

    if (results.length === 0) {
      return sendResponse(res, 404, 'No payment found with the provided paymentId');
    }

    return sendResponse(res, 200, 'Payments found successfully', results);
  } catch (error) {
    console.error('Error searching payments:', error.message, error.stack);
    return sendResponse(res, 500, `Server error while searching payments: ${error.message}`);
  }
};