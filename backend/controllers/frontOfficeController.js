const mongoose = require('mongoose');
const FrontOfficeEntry = require('../models/FrontOfficeEntry');

// Get all entries for a specific type and school
exports.getEntries = async (req, res) => {
  try {
    const { adminID, type } = req.params;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const validTypes = ['Purpose', 'Complaint Type', 'Source', 'Reference'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: 'Invalid entry type' });
    }
    const entries = await FrontOfficeEntry.find({
      school: new mongoose.Types.ObjectId(adminID),
      type,
    })
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json({
      message: 'Entries fetched successfully',
      data: entries,
      count: entries.length,
    });
  } catch (error) {
    console.error(`Error fetching entries: ${error.message}`);
    res.status(500).json({ message: 'Server error while fetching entries', error: error.message });
  }
};
// Add a new entry
exports.addEntry = async (req, res) => {
  try {
    const { name, description, type, adminID } = req.body;

    // Validate required fields
    if (!name || !type || !adminID) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate adminID
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }

    // Validate type
    const validTypes = ['Purpose', 'Complaint Type', 'Source', 'Reference'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: 'Invalid entry type' });
    }

    const newEntry = new FrontOfficeEntry({
      name,
      description: description || '',
      type,
      school: new mongoose.Types.ObjectId(adminID),
    });

    await newEntry.save();

    res.status(201).json({ message: 'Entry added successfully', data: newEntry });
  } catch (error) {
    console.error(`Error adding entry: ${error.message}`);
    res.status(500).json({ message: 'Server error while adding entry', error: error.message });
  }
};

// Update an existing entry
exports.updateEntry = async (req, res) => {
  try {
    const { name, description, adminID } = req.body;
    const { id } = req.params;

    // Validate adminID
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }

    // Validate entry ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid entry ID format' });
    }

    const entry = await FrontOfficeEntry.findOne({
      _id: id,
      school: new mongoose.Types.ObjectId(adminID),
    });

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    entry.name = name || entry.name;
    entry.description = description !== undefined ? description : entry.description;

    await entry.save();

    res.status(200).json({ message: 'Entry updated successfully', data: entry });
  } catch (error) {
    console.error(`Error updating entry: ${error.message}`);
    res.status(500).json({ message: 'Server error while updating entry', error: error.message });
  }
};

// Delete an entry
exports.deleteEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminID } = req.query;

    // Validate adminID
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }

    // Validate entry ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid entry ID format' });
    }

    const entry = await FrontOfficeEntry.findOneAndDelete({
      _id: id,
      school: new mongoose.Types.ObjectId(adminID),
    });

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.status(200).json({ message: 'Entry deleted successfully' });
  } catch (error) {
    console.error(`Error deleting entry: ${error.message}`);
    res.status(500).json({ message: 'Server error while deleting entry', error: error.message });
  }
};