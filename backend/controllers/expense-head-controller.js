const mongoose = require('mongoose');
const ExpenseHead = require('../models/expense-head-model');

exports.getExpenseHeads = async (req, res) => {
  try {
    const adminID = req.params.adminID;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      console.error(`Invalid adminID format: ${adminID}`);
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    console.log(`Fetching expense heads for adminID: ${adminID}`);
    const expenseHeads = await ExpenseHead.find({ school: new mongoose.Types.ObjectId(adminID) })
      .sort({ createdAt: -1 })
      .lean();
    console.log(`Found ${expenseHeads.length} expense heads for adminID: ${adminID}`);
    res.status(200).json({
      message: 'Expense heads fetched successfully',
      data: expenseHeads,
      count: expenseHeads.length,
    });
  } catch (error) {
    console.error('Error fetching expense heads:', error.message);
    res.status(500).json({ message: 'Server error while fetching expense heads', error: error.message });
  }
};

exports.addExpenseHead = async (req, res) => {
  try {
    const { name, description, adminID } = req.body;
    if (!name || !description || !adminID) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const newExpenseHead = new ExpenseHead({
      name: name.trim(),
      description: description.trim(),
      active: true,
      school: new mongoose.Types.ObjectId(adminID),
    });
    await newExpenseHead.save();
    console.log('Added new expense head:', newExpenseHead);
    res.status(201).json({ message: 'Expense head added successfully', data: newExpenseHead });
  } catch (error) {
    console.error('Error adding expense head:', error.message);
    res.status(500).json({ message: 'Server error while adding expense head', error: error.message });
  }
};

exports.updateExpenseHead = async (req, res) => {
  try {
    const { name, description, active, adminID } = req.body;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const expenseHead = await ExpenseHead.findOne({ _id: req.params.id, school: new mongoose.Types.ObjectId(adminID) });
    if (!expenseHead) {
      return res.status(404).json({ message: 'Expense head not found' });
    }
    expenseHead.name = name ? name.trim() : expenseHead.name;
    expenseHead.description = description ? description.trim() : expenseHead.description;
    expenseHead.active = active !== undefined ? active : expenseHead.active;
    await expenseHead.save();
    console.log('Updated expense head:', expenseHead);
    res.status(200).json({ message: 'Expense head updated successfully', data: expenseHead });
  } catch (error) {
    console.error('Error updating expense head:', error.message);
    res.status(500).json({ message: 'Server error while updating expense head', error: error.message });
  }
};

exports.deleteExpenseHead = async (req, res) => {
  try {
    const adminID = req.query.adminID;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const expenseHead = await ExpenseHead.findOneAndDelete({ _id: req.params.id, school: new mongoose.Types.ObjectId(adminID) });
    if (!expenseHead) {
      return res.status(404).json({ message: 'Expense head not found' });
    }
    console.log('Deleted expense head:', expenseHead);
    res.status(200).json({ message: 'Expense head deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense head:', error.message);
    res.status(500).json({ message: 'Server error while deleting expense head', error: error.message });
  }
};