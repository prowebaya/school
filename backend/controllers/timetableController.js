// controllers/timetableController.js
const Timetable = require('../models/Timetable');
const Attendance = require('../models/Attendance');
const mongoose = require('mongoose');

exports.getTeacherTimetable = async (req, res) => {
  try {
    const { adminID, teacherId } = req.params;
    console.log(`Fetching timetable for adminID: ${adminID}, teacherId: ${teacherId}`);

    if (!mongoose.Types.ObjectId.isValid(adminID) || !mongoose.Types.ObjectId.isValid(teacherId)) {
      console.log('Invalid ID format:', { adminID, teacherId });
      return res.status(400).json({ message: 'Invalid adminID or teacherId format' });
    }

    const timetables = await Timetable.find({ admin: adminID, teacher: teacherId })
      .populate('teacher', 'fullName teacherId')
      .lean();
    console.log('Timetables found:', timetables);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const timetableByDay = days.reduce((acc, day) => {
      acc[day] = timetables
        .filter((entry) => entry.day === day)
        .map((entry) => ({
          class: entry.class,
          section: entry.section,
          subject: entry.subject,
          time: entry.time,
          room: entry.room,
          _id: entry._id,
        }));
      return acc;
    }, {});

    console.log('Timetable by day:', timetableByDay);
    res.status(200).json({
      message: 'Timetable fetched successfully',
      data: timetableByDay,
    });
  } catch (error) {
    console.error('Error in getTeacherTimetable:', error.message);
    res.status(500).json({ message: 'Server error while fetching timetable', error: error.message });
  }
};

exports.addAttendance = async (req, res) => {
  try {
    const { adminID } = req.params;
    const { timetableId, date, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(adminID) || !mongoose.Types.ObjectId.isValid(timetableId)) {
      return res.status(400).json({ message: 'Invalid adminID or timetableId format' });
    }

    if (!['Present', 'Absent', 'Leave'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be Present, Absent, or Leave' });
    }

    const timetable = await Timetable.findOne({ _id: timetableId, admin: adminID });
    if (!timetable) {
      return res.status(404).json({ message: 'Timetable entry not found' });
    }

    const attendance = new Attendance({
      timetable: timetableId,
      date,
      status,
      admin: adminID,
    });

    await attendance.save();

    res.status(201).json({
      message: 'Attendance added successfully',
      data: attendance,
    });
  } catch (error) {
    console.error('Error in addAttendance:', error.message);
    res.status(500).json({ message: 'Server error while adding attendance', error: error.message });
  }
};

exports.addTimetable = async (req, res) => {
  try {
    const { adminID } = req.params;
    const { teacherId, class: className, section, subject, day, time, room } = req.body;

    if (!mongoose.Types.ObjectId.isValid(adminID) || !mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({ message: 'Invalid adminID or teacherId format' });
    }

    if (!className || !section || !subject || !day || !time || !room) {
      return res.status(400).json({ message: 'All fields (class, section, subject, day, time, room) are required' });
    }

    const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    if (!validDays.includes(day)) {
      return res.status(400).json({ message: 'Invalid day. Must be one of: ' + validDays.join(', ') });
    }

    const timetable = new Timetable({
      teacher: teacherId,
      class: className,
      section,
      subject,
      day,
      time,
      room,
      admin: adminID,
    });

    await timetable.save();

    res.status(201).json({
      message: 'Timetable entry added successfully',
      data: timetable,
    });
  } catch (error) {
    console.error('Error in addTimetable:', error.message);
    res.status(500).json({ message: 'Server error while adding timetable', error: error.message });
  }
};

module.exports = exports;