const mongoose = require('mongoose');
const Reminder = require('../models/reminderModel');
const { sanitize } = require('express-mongo-sanitize');

const sendResponse = (res, status, message, data = null, count = null) => {
  const response = { message };
  if (data !== null) response.data = data;
  if (count !== null) response.count = count;
  return res.status(status).json(response);
};

exports.getReminders = async (req, res) => {
  try {
    const { adminID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return sendResponse(res, 400, 'Invalid adminID format');
    }

    const reminders = await Reminder.find({ school: new mongoose.Types.ObjectId(adminID) }).lean();

    const formattedReminders = reminders.map((r) => ({
      id: r._id.toString(),
      action: r.action,
      type: r.type,
      days: r.days,
    }));

    return sendResponse(res, 200, 'Reminders fetched successfully', formattedReminders, formattedReminders.length);
  } catch (error) {
    console.error('Error fetching reminders:', error.message, error.stack);
    return sendResponse(res, 500, `Server error while fetching reminders: ${error.message}`);
  }
};

exports.updateReminders = async (req, res) => {
  try {
    const { adminID } = req.params;
    const sanitizedData = sanitize(req.body);

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return sendResponse(res, 400, 'Invalid adminID format');
    }

    if (!Array.isArray(sanitizedData) || sanitizedData.length === 0) {
      return sendResponse(res, 400, 'Reminders array is required and cannot be empty');
    }

    const updatedReminders = [];
    for (const reminder of sanitizedData) {
      const { id, action, type, days } = reminder;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return sendResponse(res, 400, `Invalid reminder ID format: ${id}`);
      }

      if (!action || !type || !days) {
        return sendResponse(res, 400, 'Action, type, and days are required for each reminder');
      }

      const reminderData = {
        action,
        type,
        days: Number(days),
      };

      const updatedReminder = await Reminder.findOneAndUpdate(
        { _id: id, school: new mongoose.Types.ObjectId(adminID) },
        { $set: reminderData },
        { new: true, runValidators: true }
      ).lean();

      if (!updatedReminder) {
        return sendResponse(res, 404, `Reminder not found: ${id}`);
      }

      updatedReminders.push({
        id: updatedReminder._id.toString(),
        action: updatedReminder.action,
        type: updatedReminder.type,
        days: updatedReminder.days,
      });
    }

    return sendResponse(res, 200, 'Reminders updated successfully', updatedReminders, updatedReminders.length);
  } catch (error) {
    console.error('Error updating reminders:', error.message, error.stack);
    if (error.code === 11000) {
      return sendResponse(res, 400, 'Duplicate reminder (type and days) already exists');
    }
    return sendResponse(res, 500, `Server error while updating reminders: ${error.message}`);
  }
};