// controllers/item-controller.js
const mongoose = require('mongoose');
const Item = require('../models/Item');

exports.getAllItems = async (req, res) => {
  try {
    const adminID = req.params.adminID;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      console.error(`Invalid adminID format: ${adminID}`);
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    console.log(`Fetching items for adminID: ${adminID}`);
    const items = await Item.find({ admin: new mongoose.Types.ObjectId(adminID) })
      .sort({ createdAt: -1 })
      .lean();
    console.log(`Found ${items.length} items for adminID: ${adminID}`);
    res.status(200).json({
      message: 'Items fetched successfully',
      data: items,
      count: items.length,
    });
  } catch (error) {
    console.error('Error fetching items:', error.message);
    res.status(500).json({ message: 'Server error while fetching items', error: error.message });
  }
};

exports.addItem = async (req, res) => {
  try {
    const { item, description, category, unit, availableQuantity, adminID } = req.body;
    if (!item || !category || !unit || !availableQuantity || !adminID) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const existingItem = await Item.findOne({ item, admin: new mongoose.Types.ObjectId(adminID) });
    if (existingItem) {
      return res.status(400).json({ message: 'Item name already exists for this admin' });
    }
    const newItem = new Item({
      item,
      description: description || '',
      category,
      unit,
      availableQuantity: parseInt(availableQuantity),
      admin: new mongoose.Types.ObjectId(adminID),
    });
    await newItem.save();
    res.status(201).json({ message: 'Item added successfully', data: newItem });
  } catch (error) {
    console.error('Error adding item:', error.message);
    res.status(500).json({ message: 'Server error while adding item', error: error.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { item, description, category, unit, availableQuantity, adminID } = req.body;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const existingItem = await Item.findOne({ _id: req.params.id, admin: new mongoose.Types.ObjectId(adminID) });
    if (!existingItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    const duplicateItem = await Item.findOne({
      item,
      admin: new mongoose.Types.ObjectId(adminID),
      _id: { $ne: req.params.id },
    });
    if (duplicateItem) {
      return res.status(400).json({ message: 'Item name already exists' });
    }
    existingItem.item = item || existingItem.item;
    existingItem.description = description || existingItem.description;
    existingItem.category = category || existingItem.category;
    existingItem.unit = unit || existingItem.unit;
    existingItem.availableQuantity = parseInt(availableQuantity) || existingItem.availableQuantity;
    await existingItem.save();
    res.status(200).json({ message: 'Item updated successfully', data: existingItem });
  } catch (error) {
    console.error('Error updating item:', error.message);
    res.status(500).json({ message: 'Server error while updating item', error: error.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const adminID = req.query.adminID;
    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return res.status(400).json({ message: 'Invalid adminID format' });
    }
    const item = await Item.findOneAndDelete({ _id: req.params.id, admin: new mongoose.Types.ObjectId(adminID) });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error.message);
    res.status(500).json({ message: 'Server error while deleting item', error: error.message });
  }
};