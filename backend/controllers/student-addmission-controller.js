const mongoose = require('mongoose');
const AdmissionForm = require('../models/student-addmission-model');
const { sanitize } = require('express-mongo-sanitize');

const sendResponse = (res, status, message, data = null, count = null) => {
  const response = { message };
  if (data !== null) response.data = data;
  if (count !== null) response.count = count;
  return res.status(status).json(response);
};

exports.getAdmissionForms = async (req, res) => {
  try {
    const adminID = req.params.adminID;

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return sendResponse(res, 400, 'Invalid adminID format');
    }

    // Fetch admission forms without populate first
    const admissionForms = await AdmissionForm.find({ school: new mongoose.Types.ObjectId(adminID) })
      .sort({ createdAt: -1 })
      .lean();

    // Manually populate valid references
    const populatedForms = await Promise.all(
      admissionForms.map(async (form) => {
        let populatedForm = { ...form };

        // Populate classId
        if (form.classId && mongoose.Types.ObjectId.isValid(form.classId)) {
          try {
            const classDoc = await mongoose.model('Class').findById(form.classId, 'name').lean();
            populatedForm.classId = classDoc ? { _id: form.classId, name: classDoc.name } : null;
          } catch (err) {
            console.error(`Failed to populate classId ${form.classId}:`, err.message);
            populatedForm.classId = null;
          }
        } else {
          populatedForm.classId = null;
        }

        // Populate routeId
        if (form.routeId && mongoose.Types.ObjectId.isValid(form.routeId)) {
          try {
            const routeDoc = await mongoose.model('TransportRoute').findById(form.routeId, 'title').lean();
            populatedForm.routeId = routeDoc ? { _id: form.routeId, title: routeDoc.title } : null;
          } catch (err) {
            console.error(`Failed to populate routeId ${form.routeId}:`, err.message);
            populatedForm.routeId = null;
          }
        } else {
          populatedForm.routeId = null;
        }

        // Populate pickupPointId
        if (form.pickupPointId && mongoose.Types.ObjectId.isValid(form.pickupPointId)) {
          try {
            const pickupDoc = await mongoose.model('PickupPoint').findById(form.pickupPointId, 'name').lean();
            populatedForm.pickupPointId = pickupDoc ? { _id: form.pickupPointId, name: pickupDoc.name } : null;
          } catch (err) {
            console.error(`Failed to populate pickupPointId ${form.pickupPointId}:`, err.message);
            populatedForm.pickupPointId = null;
          }
        } else {
          populatedForm.pickupPointId = null;
        }

        return populatedForm;
      })
    );

    return sendResponse(res, 200, 'Admission forms fetched successfully', populatedForms, populatedForms.length);
  } catch (error) {
    console.error('Error fetching admission forms:', error.message, error.stack);
    return sendResponse(res, 500, `Server error while fetching admission forms: ${error.message}`);
  }
};

exports.addAdmissionForm = async (req, res) => {
  try {
    const {
      admissionNo,
      rollNo,
      classId,
      section,
      firstName,
      lastName,
      gender,
      dob,
      routeId,
      pickupPointId,
      feesMonth,
      fees,
      parents,
      additionalDetails,
      adminID,
    } = sanitize(req.body);

    if (!admissionNo || !classId || !section || !firstName || !dob || !adminID) {
      return sendResponse(res, 400, 'Missing required fields: admissionNo, classId, section, firstName, dob, adminID');
    }

    if (!mongoose.Types.ObjectId.isValid(adminID) || !mongoose.Types.ObjectId.isValid(classId)) {
      return sendResponse(res, 400, 'Invalid adminID or classId format');
    }

    if (dob && isNaN(new Date(dob).getTime())) {
      return sendResponse(res, 400, 'Invalid date format for DOB');
    }

    if (fees && Array.isArray(fees)) {
      for (const fee of fees) {
        if (!fee.feeType || !fee.dueDate || !fee.amount || isNaN(new Date(fee.dueDate).getTime())) {
          return sendResponse(res, 400, 'Invalid fee data');
        }
      }
    }

    const newAdmissionForm = new AdmissionForm({
      admissionNo,
      rollNo,
      classId: new mongoose.Types.ObjectId(classId),
      section,
      firstName,
      lastName,
      gender,
      dob: new Date(dob),
      routeId: routeId ? new mongoose.Types.ObjectId(routeId) : null,
      pickupPointId: pickupPointId ? new mongoose.Types.ObjectId(pickupPointId) : null,
      feesMonth,
      fees,
      parents,
      additionalDetails,
      school: new mongoose.Types.ObjectId(adminID),
    });

    await newAdmissionForm.save();
    return sendResponse(res, 201, 'Admission form added successfully', newAdmissionForm);
  } catch (error) {
    console.error('Error adding admission form:', error.stack);
    return sendResponse(res, 500, 'Server error while adding admission form');
  }
};

exports.updateAdmissionForm = async (req, res) => {
  try {
    const {
      admissionNo,
      rollNo,
      classId,
      section,
      firstName,
      lastName,
      gender,
      dob,
      routeId,
      pickupPointId,
      feesMonth,
      fees,
      parents,
      additionalDetails,
      adminID,
    } = sanitize(req.body);

    if (!mongoose.Types.ObjectId.isValid(adminID) || (classId && !mongoose.Types.ObjectId.isValid(classId))) {
      return sendResponse(res, 400, 'Invalid adminID or classId format');
    }

    if (dob && isNaN(new Date(dob).getTime())) {
      return sendResponse(res, 400, 'Invalid date format for DOB');
    }

    if (fees && Array.isArray(fees)) {
      for (const fee of fees) {
        if (!fee.feeType || !fee.dueDate || !fee.amount || isNaN(new Date(fee.dueDate).getTime())) {
          return sendResponse(res, 400, 'Invalid fee data');
        }
      }
    }

    const admissionForm = await AdmissionForm.findOne({ _id: req.params.id, school: new mongoose.Types.ObjectId(adminID) });
    if (!admissionForm) {
      return sendResponse(res, 404, 'Admission form not found');
    }

    admissionForm.admissionNo = admissionNo ?? admissionForm.admissionNo;
    admissionForm.rollNo = rollNo ?? admissionForm.rollNo;
    admissionForm.classId = classId ? new mongoose.Types.ObjectId(classId) : admissionForm.classId;
    admissionForm.section = section ?? admissionForm.section;
    admissionForm.firstName = firstName ?? admissionForm.firstName;
    admissionForm.lastName = lastName ?? admissionForm.lastName;
    admissionForm.gender = gender ?? admissionForm.gender;
    admissionForm.dob = dob ? new Date(dob) : admissionForm.dob;
    admissionForm.routeId = routeId ? new mongoose.Types.ObjectId(routeId) : admissionForm.routeId;
    admissionForm.pickupPointId = pickupPointId ? new mongoose.Types.ObjectId(pickupPointId) : admissionForm.pickupPointId;
    admissionForm.feesMonth = feesMonth ?? admissionForm.feesMonth;
    admissionForm.fees = fees ?? admissionForm.fees;
    admissionForm.parents = parents ?? admissionForm.parents;
    admissionForm.additionalDetails = additionalDetails ?? admissionForm.additionalDetails;

    await admissionForm.save();
    return sendResponse(res, 200, 'Admission form updated successfully', admissionForm);
  } catch (error) {
    console.error('Error updating admission form:', error.stack);
    return sendResponse(res, 500, 'Server error while updating admission form');
  }
};

exports.deleteAdmissionForm = async (req, res) => {
  try {
    const adminID = req.query.adminID;

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return sendResponse(res, 400, 'Invalid adminID format');
    }

    const admissionForm = await AdmissionForm.findOneAndDelete({
      _id: req.params.id,
      school: new mongoose.Types.ObjectId(adminID),
    });

    if (!admissionForm) {
      return sendResponse(res, 404, 'Admission form not found');
    }

    return sendResponse(res, 200, 'Admission form deleted successfully');
  } catch (error) {
    console.error('Error deleting admission form:', error.stack);
    return sendResponse(res, 500, 'Server error while deleting admission form');
  }
};