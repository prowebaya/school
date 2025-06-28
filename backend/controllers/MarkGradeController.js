const MarkGrade = require('../models/MarkGradeModel');

exports.createMarkGrade = async (req, res) => {
  const { name, from, to, adminID } = req.body;

  if (!name || isNaN(from) || isNaN(to) || parseFloat(from) > parseFloat(to)) {
    return res.status(400).json({ message: 'Invalid mark grade data' });
  }

  try {
    const newGrade = new MarkGrade({
      name,
      from,
      to,
      createdBy: adminID
    });
    await newGrade.save();
    res.status(201).json(newGrade);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllMarkGrades = async (req, res) => {
  const { adminID } = req.query; // Use req.query for GET requests

  if (!adminID) {
    return res.status(400).json({ message: 'adminID is required' });
  }

  try {
    const grades = await MarkGrade.find({ createdBy: adminID });
    res.status(200).json(grades);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateMarkGrade = async (req, res) => {
  const { id } = req.params;
  const { name, from, to, adminID } = req.body;

  try {
    const updatedGrade = await MarkGrade.findOneAndUpdate(
      { _id: id, createdBy: adminID },
      { name, from, to },
      { new: true }
    );

    if (!updatedGrade) {
      return res.status(404).json({ message: 'Mark grade not found' });
    }

    res.status(200).json(updatedGrade);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Fix DELETE endpoint
exports.deleteMarkGrade = async (req, res) => {
  const { id } = req.params;
  const { adminID } = req.query; // Use req.query for DELETE

  try {
    const deletedGrade = await MarkGrade.findOneAndDelete({
      _id: id,
      createdBy: adminID
    });

    if (!deletedGrade) {
      return res.status(404).json({ message: 'Mark grade not found' });
    }

    res.status(200).json({ message: 'Mark grade deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
