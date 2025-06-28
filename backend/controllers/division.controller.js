const mongoose = require('mongoose');
const Division = require('../models/division.model');

// Create Division
exports.createDivision = async (req, res) => {
  try {
    console.log("Creating Division:", req.body);
    const { name, percentFrom, percentUpto, adminID } = req.body;

    if (!name || percentFrom === undefined || percentUpto === undefined || !adminID) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existingDivision = await Division.findOne({ name, createdBy: adminID });
    if (existingDivision) {
      return res.status(400).json({ message: 'Division name already exists' });
    }

    const newDivision = new Division({
      name,
      percentFrom,
      percentUpto,
      createdBy: adminID
    });

    await newDivision.save();
    res.status(201).json({ success: true, division: newDivision });
  } catch (error) {
    console.error("Error in createDivision:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get All Divisions by adminID
exports.getDivisions = async (req, res) => {
  try {
    const { adminID } = req.query;

    console.log("adminID from query:", adminID); // Debugging

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }

    const divisions = await Division.find({ createdBy: new mongoose.Types.ObjectId(adminID) }).sort({ percentFrom: -1 });
    console.log("Fetched divisions count:", divisions.length);
    res.status(200).json(divisions);
  } catch (error) {
    console.error("Error in getDivisions:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get Division By ID
exports.getDivisionById = async (req, res) => {
  try {
    const division = await Division.findById(req.params.id);

    if (!division) {
      return res.status(404).json({ error: 'Division not found' });
    }

    res.status(200).json(division);
  } catch (error) {
    console.error("Error in getDivisionById:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update Division
exports.updateDivision = async (req, res) => {
  try {
    const division = await Division.findById(req.params.id);

    if (!division) {
      return res.status(404).json({ error: 'Division not found' });
    }

    const { name, percentFrom, percentUpto } = req.body;

    if (name && name !== division.name) {
      const duplicate = await Division.findOne({
        name,
        createdBy: division.createdBy,
        _id: { $ne: division._id }
      });
      if (duplicate) {
        return res.status(400).json({ message: 'Division name already exists' });
      }
    }

    division.name = name || division.name;
    division.percentFrom = percentFrom !== undefined ? percentFrom : division.percentFrom;
    division.percentUpto = percentUpto !== undefined ? percentUpto : division.percentUpto;

    const error = division.validateSync();
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    await division.save();
    res.status(200).json(division);
  } catch (error) {
    console.error("Error in updateDivision:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete Division
exports.deleteDivision = async (req, res) => {
  try {
    const { adminID } = req.body;
    const division = await Division.findOneAndDelete({ _id: req.params.id, createdBy: adminID });

    if (!division) {
      return res.status(404).json({ error: 'Division not found' });
    }

    res.status(200).json({ message: 'Division deleted successfully' });
  } catch (error) {
    console.error("Error in deleteDivision:", error);
    res.status(500).json({ error: error.message });
  }
};
