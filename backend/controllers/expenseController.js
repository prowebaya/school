const mongoose = require('mongoose');
const Expense = require('../models/Expense');
const fs = require('fs');
const path = require('path');

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '../uploads/Expenses');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

exports.getExpenses = async (req, res) => {
  try {
    const adminID = req.params.adminID;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      console.error(`Invalid adminID format: ${adminID}`);
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    console.log(`Fetching expenses for adminID: ${adminID}`);
    const expenses = await Expense.find({ school: new mongoose.Types.ObjectId(adminID) })
      .sort({ createdAt: -1 })
      .lean();
    console.log(`Found ${expenses.length} expenses for adminID: ${adminID}`);
    res.status(200).json({
      message: 'Expenses fetched successfully',
      data: expenses,
      count: expenses.length,
    });
  } catch (error) {
    console.error('Error fetching expenses:', error.message);
    res.status(500).json({ message: 'Server error while fetching expenses', error: error.message });
  }
};

exports.addExpense = async (req, res) => {
  try {
    const { expenseHead, name, invoiceNumber, date, amount, description, adminID } = req.body;
    if (!expenseHead || !name || !date || !amount || !adminID) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }

    let attachedFilePath = null;
    if (req.file) {
      attachedFilePath = `/Uploads/Expenses/${req.file.filename}`;
    }

    const newExpense = new Expense({
      expenseHead,
      name,
      invoiceNumber,
      date,
      amount,
      description,
      attachedFile: attachedFilePath,
      school: new mongoose.Types.ObjectId(adminID),
    });

    await newExpense.save();
    console.log('Added new expense:', newExpense);
    res.status(201).json({ message: 'Expense added successfully', data: newExpense });
  } catch (error) {
    console.error('Error adding expense:', error.message);
    res.status(500).json({ message: 'Server error while adding expense', error: error.message });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const { expenseHead, name, invoiceNumber, date, amount, description, adminID } = req.body;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const expense = await Expense.findOne({ _id: req.params.id, school: new mongoose.Types.ObjectId(adminID) });
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    let attachedFilePath = expense.attachedFile;
    if (req.file) {
      // Delete old file if it exists
      if (expense.attachedFile) {
        const oldFilePath = path.join(__dirname, '../', expense.attachedFile);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      attachedFilePath = `/Uploads/Expenses/${req.file.filename}`;
    }

    expense.expenseHead = expenseHead || expense.expenseHead;
    expense.name = name || expense.name;
    expense.invoiceNumber = invoiceNumber || expense.invoiceNumber;
    expense.date = date || expense.date;
    expense.amount = amount || expense.amount;
    expense.description = description || expense.description;
    expense.attachedFile = attachedFilePath;

    await expense.save();
    console.log('Updated expense:', expense);
    res.status(200).json({ message: 'Expense updated successfully', data: expense });
  } catch (error) {
    console.error('Error updating expense:', error.message);
    res.status(500).json({ message: 'Server error while updating expense', error: error.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const adminID = req.query.adminID;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, school: new mongoose.Types.ObjectId(adminID) });
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Delete associated file if it exists
    if (expense.attachedFile) {
      const filePath = path.join(__dirname, '../', expense.attachedFile);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    console.log('Deleted expense:', expense);
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error.message);
    res.status(500).json({ message: 'Server error while deleting expense', error: error.message });
  }
};