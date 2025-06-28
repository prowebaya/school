const mongoose = require('mongoose');
const AdmissionForm = require('../models/student-addmission-model');
const { sanitize } = require('express-mongo-sanitize');

const sendResponse = (res, status, message, data = null, count = null) => {
  const response = { message };
  if (data !== null) response.data = data;
  if (count !== null) response.count = count;
  return res.status(status).json(response);
};

exports.searchStudents = async (req, res) => {
  try {
    const { adminID } = req.params;
    const { admissionNo, name, classId, section } = sanitize(req.query);

    // Validate adminID
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return sendResponse(res, 400, 'Invalid adminID format');
    }

    // Build query
    const query = { school: new mongoose.Types.ObjectId(adminID) };

    // Filter by admissionNo (case-insensitive)
    if (admissionNo) {
      query.admissionNo = { $regex: admissionNo.trim(), $options: 'i' };
    }

    // Filter by name (case-insensitive, partial match on firstName, lastName, or full name)
    if (name && name.trim()) {
      const nameWords = name.trim().split(/\s+/).filter(word => word).map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')); // Escape regex special chars
      if (nameWords.length > 0) {
        const nameRegex = nameWords.join('|'); // Match any word
        query.$or = [
          { firstName: { $regex: nameRegex, $options: 'i' } },
          { lastName: { $regex: nameRegex, $options: 'i' } },
          { $expr: { $regexMatch: { input: { $concat: ['$firstName', ' ', '$lastName'] }, regex: name.trim(), options: 'i' } } },
        ];
      }
    }

    // Filter by classId
    if (classId && mongoose.Types.ObjectId.isValid(classId)) {
      query.classId = new mongoose.Types.ObjectId(classId);
    } else if (classId) {
      return sendResponse(res, 400, 'Invalid classId format');
    }

    // Filter by section (case-insensitive, exact match)
    if (section && section.trim()) {
      query.section = { $regex: `^${section.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' };
    }

    console.log('Search Query:', JSON.stringify(query, null, 2)); // Debug log

    // Execute query
    const admissionForms = await AdmissionForm.find(query)
      .sort({ createdAt: -1 })
      .lean();

    // Manually populate references
    const populatedForms = await Promise.all(
      admissionForms.map(async (form) => {
        let populatedForm = { ...form };

        // Populate classId
        if (form.classId && mongoose.Types.ObjectId.isValid(form.classId)) {
          try {
            const classDoc = await mongoose.model('Class').findById(form.classId, 'name sections').lean();
            populatedForm.classId = classDoc ? { _id: form.classId, name: classDoc.name, sections: classDoc.sections || [] } : null;
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

    return sendResponse(res, 200, 'Students fetched successfully', populatedForms, populatedForms.length);
  } catch (error) {
    console.error('Error searching students:', error.message, error.stack);
    return sendResponse(res, 500, `Server error while searching students: ${error.message}`);
  }
};