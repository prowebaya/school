const mongoose = require('mongoose');
const AdmissionForm = require('../models/student-addmission-model');
const { sanitize } = require('express-mongo-sanitize');

const sendResponse = (res, status, message, data = null, count = null) => {
  const response = { message };
  if (data !== null) response.data = data;
  if (count !== null) response.count = count;
  return res.status(status).json(response);
};

// Fetch all students for a given adminID
exports.getAllStudents = async (req, res) => {
  try {
    const { adminID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return sendResponse(res, 400, 'Invalid adminID format');
    }

    const query = { school: new mongoose.Types.ObjectId(adminID) };

    const admissionForms = await AdmissionForm.find(query)
      .sort({ createdAt: -1 })
      .lean();

    // Manually populate references
    const populatedForms = await Promise.all(
      admissionForms.map(async (form) => {
        let populatedForm = {
          id: form._id.toString(), // Use _id as id for frontend
          admissionNo: form.admissionNo,
          name: `${form.firstName} ${form.lastName || ''}`.trim(),
          class: null,
          dob: form.dob ? new Date(form.dob).toLocaleDateString('en-US') : '',
          gender: form.gender || '',
          mobile: form.parents?.father?.phone || form.parents?.mother?.phone || '',
        };

        // Populate classId
        if (form.classId && mongoose.Types.ObjectId.isValid(form.classId)) {
          try {
            const classDoc = await mongoose.model('Class').findById(form.classId, 'name sections').lean();
            populatedForm.class = classDoc ? `${classDoc.name}(${form.section || ''})` : '';
          } catch (err) {
            console.error(`Failed to populate classId ${form.classId}:`, err.message);
            populatedForm.class = '';
          }
        }

        return populatedForm;
      })
    );

    return sendResponse(res, 200, 'Students fetched successfully', populatedForms, populatedForms.length);
  } catch (error) {
    console.error('Error fetching students:', error.message, error.stack);
    return sendResponse(res, 500, `Server error while fetching students: ${error.message}`);
  }
};

// Delete multiple students by IDs
exports.bulkDeleteStudents = async (req, res) => {
  try {
    const { adminID } = req.params;
    const { studentIds } = sanitize(req.body);

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return sendResponse(res, 400, 'Invalid adminID format');
    }

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return sendResponse(res, 400, 'Student IDs must be a non-empty array');
    }

    // Validate all studentIds
    const validIds = studentIds.filter(id => mongoose.Types.ObjectId.isValid(id));
    if (validIds.length !== studentIds.length) {
      return sendResponse(res, 400, 'One or more student IDs are invalid');
    }

    // Delete students
    const result = await AdmissionForm.deleteMany({
      _id: { $in: validIds.map(id => new mongoose.Types.ObjectId(id)) },
      school: new mongoose.Types.ObjectId(adminID),
    });

    if (result.deletedCount === 0) {
      return sendResponse(res, 404, 'No students found for deletion');
    }

    return sendResponse(res, 200, `Successfully deleted ${result.deletedCount} student(s)`);
  } catch (error) {
    console.error('Error deleting students:', error.message, error.stack);
    return sendResponse(res, 500, `Server error while deleting students: ${error.message}`);
  }
};