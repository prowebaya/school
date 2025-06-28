const mongoose = require("mongoose");
const PhoneCallLog = require("../models/PhoneCall");

exports.getPhoneCallLogs = async (req, res) => {
  try {
    const adminID = req.params.adminID;

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      console.error(`Invalid adminID format: ${adminID}`);
      return res.status(400).json({ message: "Invalid adminID format" });
    }

    console.log(`Fetching phone call logs for adminID: ${adminID}`);
    const logs = await PhoneCallLog.find({ school: new mongoose.Types.ObjectId(adminID) })
      .sort({ createdAt: -1 })
      .lean();

    console.log(`Found ${logs.length} phone call logs for adminID: ${adminID}`);
    res.status(200).json({
      message: logs.length ? "Phone call logs fetched successfully" : "No phone call logs found",
      data: logs,
      count: logs.length,
    });
  } catch (error) {
    console.error("Error fetching phone call logs:", error.message);
    res.status(500).json({
      message: "Server error while fetching phone call logs",
      error: error.message,
    });
  }
};

exports.addPhoneCallLog = async (req, res) => {
  try {
    const { name, phone, date, description, followUpDate, duration, note, callType, adminID } = req.body;

    if (!name || !phone || !date || !description || !followUpDate || !duration || !note || !callType || !adminID) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: "Invalid adminID format" });
    }

    const newLog = new PhoneCallLog({
      name,
      phone,
      date,
      description,
      followUpDate,
      duration,
      note,
      callType,
      school: new mongoose.Types.ObjectId(adminID),
    });

    const savedLog = await newLog.save();
    console.log("Saved phone call log:", savedLog);
    res.status(201).json({
      message: "Phone call log added successfully",
      data: savedLog,
    });
  } catch (error) {
    console.error("Error adding phone call log:", error.message);
    res.status(500).json({
      message: "Server error while adding phone call log",
      error: error.message,
    });
  }
};

exports.updatePhoneCallLog = async (req, res) => {
  try {
    const { name, phone, date, description, followUpDate, duration, note, callType, adminID } = req.body;

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: "Invalid adminID format" });
    }

    const phoneCallLog = await PhoneCallLog.findOne({ _id: req.params.id, school: new mongoose.Types.ObjectId(adminID) });
    if (!phoneCallLog) {
      return res.status(404).json({ message: "Phone call log not found" });
    }

    phoneCallLog.name = name || phoneCallLog.name;
    phoneCallLog.phone = phone || phoneCallLog.phone;
    phoneCallLog.date = date || phoneCallLog.date;
    phoneCallLog.description = description || phoneCallLog.description;
    phoneCallLog.followUpDate = followUpDate || phoneCallLog.followUpDate;
    phoneCallLog.duration = duration || phoneCallLog.duration;
    phoneCallLog.note = note || phoneCallLog.note;
    phoneCallLog.callType = callType || phoneCallLog.callType;

    const updatedLog = await phoneCallLog.save();
    console.log("Updated phone call log:", updatedLog);
    res.status(200).json({
      message: "Phone call log updated successfully",
      data: updatedLog,
    });
  } catch (error) {
    console.error("Error updating phone call log:", error.message);
    res.status(500).json({
      message: "Server error while updating phone call log",
      error: error.message,
    });
  }
};

exports.deletePhoneCallLog = async (req, res) => {
  try {
    const adminID = req.query.adminID;

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: "Invalid adminID format" });
    }

    const phoneCallLog = await PhoneCallLog.findOneAndDelete({ _id: req.params.id, school: new mongoose.Types.ObjectId(adminID) });
    if (!phoneCallLog) {
      return res.status(404).json({ message: "Phone call log not found" });
    }

    console.log("Deleted phone call log:", phoneCallLog);
    res.status(200).json({ message: "Phone call log deleted successfully" });
  } catch (error) {
    console.error("Error deleting phone call log:", error.message);
    res.status(500).json({
      message: "Server error while deleting phone call log",
      error: error.message,
    });
  }
};