const mongoose = require('mongoose');
const Income = require('../models/Income');

exports.getIncomes = async (req, res) => {
  try {
    const { adminID } = req.params;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const incomes = await Income.find({
      school: new mongoose.Types.ObjectId(adminID),
    })
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json({
      message: 'Incomes fetched successfully',
      data: incomes,
      count: incomes.length,
    });
  } catch (error) {
    console.error(`Error fetching incomes: ${error.message}`);
    res.status(500).json({ message: 'Server error while fetching incomes', error: error.message });
  }
};

exports.addIncome = async (req, res) => {
  try {
    const { adminID, incomeHead, name, invoiceNumber, date, amount, document, description } = req.body;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const income = new Income({
      incomeHead,
      name,
      invoiceNumber,
      date,
      amount,
      document,
      description,
      school: new mongoose.Types.ObjectId(adminID),
    });
    await income.save();
    res.status(201).json({ message: 'Income added successfully', data: income });
  } catch (error) {
    console.error(`Error adding income: ${error.message}`);
    res.status(500).json({ message: 'Server error while adding income', error: error.message });
  }
};

exports.updateIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminID, incomeHead, name, invoiceNumber, date, amount, document, description } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    console.log(`Updating income with id: ${id}, adminID: ${adminID}`);
    const income = await Income.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id), school: new mongoose.Types.ObjectId(adminID) },
      { incomeHead, name, invoiceNumber, date, amount, document, description },
      { new: true, runValidators: true }
    );
    if (!income) {
      console.log(`Income not found for id: ${id}, adminID: ${adminID}`);
      return res.status(404).json({ message: 'Income not found' });
    }
    res.status(200).json({ message: 'Income updated successfully', data: income });
  } catch (error) {
    console.error(`Error updating income: ${error.message}`);
    res.status(500).json({ message: 'Server error while updating income', error: error.message });
  }
};

exports.deleteIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminID } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const income = await Income.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(id),
      school: new mongoose.Types.ObjectId(adminID),
    });
    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }
    res.status(200).json({ message: 'Income deleted successfully' });
  } catch (error) {
    console.error(`Error deleting income: ${error.message}`);
    res.status(500).json({ message: 'Server error while deleting income', error: error.message });
  }
};

exports.searchIncomes = async (req, res) => {
  try {
    const { adminID } = req.params;
    const { searchType, searchQuery } = req.query;

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }

    const query = { school: new mongoose.Types.ObjectId(adminID) };

    if (searchType && typeof searchType === 'string') {
      if (searchType.includes('Months')) {
        const monthsCount = parseInt(searchType.split(' ')[1]);
        const monthsAgo = new Date();
        monthsAgo.setMonth(monthsAgo.getMonth() - monthsCount);
        const dateString = monthsAgo.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        query.date = { $gte: dateString };
      } else if (searchType === 'Search' && searchQuery && typeof searchQuery === 'string') {
        query.$or = [
          { name: { $regex: searchQuery, $options: 'i' } },
          { invoiceNumber: { $regex: searchQuery, $options: 'i' } },
        ];
      } else if (searchType === 'Search By Income' && searchQuery && typeof searchQuery === 'string') {
        const amount = parseFloat(searchQuery);
        query.$or = [
          { incomeHead: { $regex: searchQuery, $options: 'i' } },
          ...(isNaN(amount) ? [] : [{ amount: amount }]),
        ];
      }
    }

    const incomes = await Income.find(query)
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      message: 'Incomes fetched successfully',
      data: incomes,
      count: incomes.length,
    });
  } catch (error) {
    console.error(`Error searching incomes: ${error.message}`);
    res.status(500).json({ message: 'Server error while searching incomes', error: error.message });
  }
};