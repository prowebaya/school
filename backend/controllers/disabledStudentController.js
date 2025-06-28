const mongoose = require('mongoose');
const DisabledStudent = require('../models/DisabledStudent');
const Reason = require('../models/reason');
const AdmissionForm = require('../models/student-addmission-model');
const { sanitize } = require('express-mongo-sanitize');

const sendResponse = (res, status, message, data = null, count = null) => {
  const response = { message };
  if (data !== null) response.data = data;
  if (count !== null) response.count = count;
  return res.status(status).json(response);
};

// Fetch all disabled students
exports.getAllDisabledStudents = async (req, res) => {
  try {
    const { adminID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return sendResponse(res, 400, 'Invalid admin ID format');
    }

    const disabledStudents = await DisabledStudent.find({ school: new mongoose.Types.ObjectId(adminID) })
      .populate({
        path: 'reasonId',
        select: 'text',
      })
      .populate({
        path: 'studentId',
        select: 'firstName lastName classId admissionNo',
        populate: { path: 'classId', select: 'name' },
      })
      .lean();

    const formattedDisabledStudents = disabledStudents.map((ds) => ({
      _id: ds._id,
      reasonId: ds.reasonId._id,
      studentId: ds.studentId._id,
      reasonText: ds.reasonId.text,
      studentName: `${ds.studentId.firstName} ${ds.studentId.lastName}`,
      studentClass: ds.studentId.classId?.name || 'N/A',
      studentAdmissionNo: ds.studentId.admissionNo,
      isEditing: false,
    }));

    return sendResponse(res, 200, 'Disabled students fetched successfully', formattedDisabledStudents, formattedDisabledStudents.length);
  } catch (error) {
    console.error('Error fetching disabled students:', error.message, error.stack);
    return sendResponse(res, 500, `Server error while fetching disabled students: ${error.message}`);
  }
};

// Create a new disabled student
exports.createDisabledStudent = async (req, res) => {
  try {
    const { adminID } = req.params;
    const { reasonId, studentId } = sanitize(req.body);

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return sendResponse(res, 400, 'Invalid admin ID format');
    }

    if (!mongoose.Types.ObjectId.isValid(reasonId) || !mongoose.Types.ObjectId.isValid(studentId)) {
      return sendResponse(res, 400, 'Invalid reason or student ID format');
    }

    const reason = await Reason.findOne({
      _id: new mongoose.Types.ObjectId(reasonId),
      school: new mongoose.Types.ObjectId(adminID),
    });

    if (!reason) {
      return sendResponse(res, 404, 'Reason not found');
    }

    const student = await AdmissionForm.findOne({
      _id: new mongoose.Types.ObjectId(studentId),
      school: new mongoose.Types.ObjectId(adminID),
    });

    if (!student) {
      return sendResponse(res, 404, 'Student not found');
    }

    const existingDisabledStudent = await DisabledStudent.findOne({
      school: new mongoose.Types.ObjectId(adminID),
      reasonId: new mongoose.Types.ObjectId(reasonId),
      studentId: new mongoose.Types.ObjectId(studentId),
    });

    if (existingDisabledStudent) {
      return sendResponse(res, 400, 'Student is already disabled for this reason');
    }

    const newDisabledStudent = new DisabledStudent({
      reasonId: new mongoose.Types.ObjectId(reasonId),
      studentId: new mongoose.Types.ObjectId(studentId),
      school: new mongoose.Types.ObjectId(adminID),
    });

    await newDisabledStudent.save();

    const populatedDisabledStudent = await DisabledStudent.findById(newDisabledStudent._id)
      .populate({
        path: 'reasonId',
        select: 'text',
      })
      .populate({
        path: 'studentId',
        select: 'firstName lastName classId admissionNo',
        populate: { path: 'classId', select: 'name' },
      })
      .lean();

    return sendResponse(res, 201, 'Disabled student created successfully', {
      _id: populatedDisabledStudent._id,
      reasonId: populatedDisabledStudent.reasonId._id,
      studentId: populatedDisabledStudent.studentId._id,
      reasonText: populatedDisabledStudent.reasonId.text,
      studentName: `${populatedDisabledStudent.studentId.firstName} ${populatedDisabledStudent.studentId.lastName}`,
      studentClass: populatedDisabledStudent.studentId.classId?.name || 'N/A',
      studentAdmissionNo: populatedDisabledStudent.studentId.admissionNo,
      isEditing: false,
    });
  } catch (error) {
    console.error('Error creating disabled student:', error.message, error.stack);
    return sendResponse(res, 500, `Server error while creating disabled student: ${error.message}`);
  }
};

// Update a disabled student
exports.updateDisabledStudent = async (req, res) => {
  try {
    const { adminID, disabledStudentId } = req.params;
    const { reasonId, studentId } = sanitize(req.body);

    if (!mongoose.Types.ObjectId.isValid(adminID) || !mongoose.Types.ObjectId.isValid(disabledStudentId)) {
      return sendResponse(res, 400, 'Invalid admin or disabled student ID format');
    }

    if (!mongoose.Types.ObjectId.isValid(reasonId) || !mongoose.Types.ObjectId.isValid(studentId)) {
      return sendResponse(res, 400, 'Invalid reason or student ID format');
    }

    const reason = await Reason.findOne({
      _id: new mongoose.Types.ObjectId(reasonId),
      school: new mongoose.Types.ObjectId(adminID),
    });

    if (!reason) {
      return sendResponse(res, 404, 'Reason not found');
    }

    const student = await AdmissionForm.findOne({
      _id: new mongoose.Types.ObjectId(studentId),
      school: new mongoose.Types.ObjectId(adminID),
    });

    if (!student) {
      return sendResponse(res, 404, 'Student not found');
    }

    const existingDisabledStudent = await DisabledStudent.findOne({
      school: new mongoose.Types.ObjectId(adminID),
      reasonId: new mongoose.Types.ObjectId(reasonId),
      studentId: new mongoose.Types.ObjectId(studentId),
      _id: { $ne: new mongoose.Types.ObjectId(disabledStudentId) },
    });

    if (existingDisabledStudent) {
      return sendResponse(res, 400, 'Student is already disabled for this reason');
    }

    const updatedDisabledStudent = await DisabledStudent.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(disabledStudentId),
        school: new mongoose.Types.ObjectId(adminID),
      },
      {
        reasonId: new mongoose.Types.ObjectId(reasonId),
        studentId: new mongoose.Types.ObjectId(studentId),
      },
      { new: true, runValidators: true }
    )
      .populate({
        path: 'reasonId',
        select: 'text',
      })
      .populate({
        path: 'studentId',
        select: 'firstName lastName classId admissionNo',
        populate: { path: 'classId', select: 'name' },
      })
      .lean();

    if (!updatedDisabledStudent) {
      return sendResponse(res, 404, 'Disabled student not found');
    }

    return sendResponse(res, 200, 'Disabled student updated successfully', {
      _id: updatedDisabledStudent._id,
      reasonId: updatedDisabledStudent.reasonId._id,
      studentId: updatedDisabledStudent.studentId._id,
      reasonText: updatedDisabledStudent.reasonId.text,
      studentName: `${updatedDisabledStudent.studentId.firstName} ${updatedDisabledStudent.studentId.lastName}`,
      studentClass: updatedDisabledStudent.studentId.classId?.name || 'N/A',
      studentAdmissionNo: updatedDisabledStudent.studentId.admissionNo,
      isEditing: false,
    });
  } catch (error) {
    console.error('Error updating disabled student:', error.message, error.stack);
    return sendResponse(res, 500, `Server error while updating disabled student: ${error.message}`);
  }
};

// Delete a disabled student
exports.deleteDisabledStudent = async (req, res) => {
  try {
    const { adminID, disabledStudentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(adminID) || !mongoose.Types.ObjectId.isValid(disabledStudentId)) {
      return sendResponse(res, 400, 'Invalid admin or disabled student ID format');
    }

    const result = await DisabledStudent.deleteOne({
      _id: new mongoose.Types.ObjectId(disabledStudentId),
      school: new mongoose.Types.ObjectId(adminID),
    });

    if (result.deletedCount === 0) {
      return sendResponse(res, 404, 'Disabled student not found');
    }

    return sendResponse(res, 200, 'Disabled student deleted successfully');
  } catch (error) {
    console.error('Error deleting disabled student:', error.message, error.stack);
    return sendResponse(res, 500, `Server error while deleting disabled student: ${error.message}`);
  }
};
exports.getAllDisabledStudents = async (req, res) => {
  try {
    const { adminID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return sendResponse(res, 400, 'Invalid admin ID format');
    }

    const disabledStudents = await DisabledStudent.find({ school: new mongoose.Types.ObjectId(adminID) })
      .populate({
        path: 'reasonId',
        select: 'text',
      })
      .populate({
        path: 'studentId',
        select: 'firstName lastName classId admissionNo',
        populate: { path: 'classId', select: 'name' },
      })
      .lean();

    const formattedDisabledStudents = disabledStudents.map((ds) => ({
      _id: ds._id,
      reasonId: ds.reasonId._id,
      studentId: ds.studentId._id,
      reasonText: ds.reasonId.text,
      studentName: `${ds.studentId.firstName} ${ds.studentId.lastName}`,
      studentClass: ds.studentId.classId?.name || 'N/A',
      studentAdmissionNo: ds.studentId.admissionNo,
      isEditing: false,
    }));

    return sendResponse(res, 200, 'Disabled students fetched successfully', formattedDisabledStudents, formattedDisabledStudents.length);
  } catch (error) {
    console.error('Error fetching disabled students:', error.message, error.stack);
    return sendResponse(res, 500, `Server error while fetching disabled students: ${error.message}`);
  }
};