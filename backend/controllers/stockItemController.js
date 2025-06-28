// controllers/stockItemController.js
const mongoose = require('mongoose');
const StockItem = require('../models/StockItem');
const path = require('path');
const fs = require('fs');

exports.getStockItems = async (req, res) => {
  try {
    const adminID = req.params.adminID;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      console.error(`Invalid adminID format: ${adminID}`);
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    console.log(`Fetching stock items for adminID: ${adminID}`);
    const stockItems = await StockItem.find({ admin: new mongoose.Types.ObjectId(adminID) })
      .sort({ createdAt: -1 })
      .lean();
    console.log(`Found ${stockItems.length} stock items for adminID: ${adminID}`);
    res.status(200).json({
      message: 'Stock items fetched successfully',
      data: stockItems,
      count: stockItems.length,
    });
  } catch (error) {
    console.error('Error fetching stock items:', error.message);
    res.status(500).json({ message: 'Server error while fetching stock items', error: error.message });
  }
};

exports.addStockItem = async (req, res) => {
  try {
    const { item, category, supplier, store, quantity, purchasePrice, purchaseDate, description, adminID } = req.body;
    const document = req.file ? `/uploads/${req.file.filename}` : null;

    if (!item || !category || !supplier || !store || !quantity || !purchasePrice || !purchaseDate || !adminID) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }

    const existingItem = await StockItem.findOne({ item, admin: new mongoose.Types.ObjectId(adminID) });
    if (existingItem) {
      return res.status(400).json({ message: 'Stock item name already exists' });
    }

    const newStockItem = new StockItem({
      item,
      category,
      supplier,
      store,
      quantity: parseInt(quantity),
      purchasePrice: parseFloat(purchasePrice),
      purchaseDate,
      document,
      description: description || '',
      admin: new mongoose.Types.ObjectId(adminID),
    });

    await newStockItem.save();
    res.status(201).json({ message: 'Stock item added successfully', data: newStockItem });
  } catch (error) {
    console.error('Error adding stock item:', error.message);
    res.status(500).json({ message: 'Server error while adding stock item', error: error.message });
  }
};

exports.updateStockItem = async (req, res) => {
  try {
    const { item, category, supplier, store, quantity, purchasePrice, purchaseDate, description, adminID } = req.body;
    const document = req.file ? `/uploads/${req.file.filename}` : req.body.document;

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid stock item ID' });
    }

    const stockItem = await StockItem.findOne({ _id: req.params.id, admin: new mongoose.Types.ObjectId(adminID) });
    if (!stockItem) {
      return res.status(404).json({ message: 'Stock item not found' });
    }

    const existingItem = await StockItem.findOne({
      item,
      admin: new mongoose.Types.ObjectId(adminID),
      _id: { $ne: req.params.id },
    });
    if (existingItem) {
      return res.status(400).json({ message: 'Stock item name already exists' });
    }

    // Delete old document if a new one is uploaded
    if (req.file && stockItem.document) {
      const oldFilePath = path.join(__dirname, '..', stockItem.document);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    stockItem.item = item || stockItem.item;
    stockItem.category = category || stockItem.category;
    stockItem.supplier = supplier || stockItem.supplier;
    stockItem.store = store || stockItem.store;
    stockItem.quantity = quantity ? parseInt(quantity) : stockItem.quantity;
    stockItem.purchasePrice = purchasePrice ? parseFloat(purchasePrice) : stockItem.purchasePrice;
    stockItem.purchaseDate = purchaseDate || stockItem.purchaseDate;
    stockItem.document = document || stockItem.document;
    stockItem.description = description || stockItem.description;

    await stockItem.save();
    res.status(200).json({ message: 'Stock item updated successfully', data: stockItem });
  } catch (error) {
    console.error('Error updating stock item:', error.message);
    res.status(500).json({ message: 'Server error while updating stock item', error: error.message });
  }
};

exports.deleteStockItem = async (req, res) => {
  try {
    const { adminID } = req.query;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid stock item ID' });
    }

    const stockItem = await StockItem.findOne({ _id: req.params.id, admin: new mongoose.Types.ObjectId(adminID) });
    if (!stockItem) {
      return res.status(404).json({ message: 'Stock item not found' });
    }

    // Delete associated document
    if (stockItem.document) {
      const filePath = path.join(__dirname, '..', stockItem.document);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await StockItem.findOneAndDelete({ _id: req.params.id, admin: new mongoose.Types.ObjectId(adminID) });
    res.status(200).json({ message: 'Stock item deleted successfully' });
  } catch (error) {
    console.error('Error deleting stock item:', error.message);
    res.status(500).json({ message: 'Server error while deleting stock item', error: error.message });
  }
};