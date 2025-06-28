const ItemStock = require('../models/AdditemStockModel');
const mongoose = require('mongoose');

// Add Item Stock
exports.addItemStock = async (req, res) => {
  try {
    const {
      item,
      category,
      supplier,
      store,
      quantity,
      purchasePrice,
      purchaseDate,
      document,
      description,
      adminID // Make sure this matches what you're sending
    } = req.body;

    // Validate required fields
    if (!item || !category || !quantity || !purchasePrice || !purchaseDate || !adminID) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const newItemStock = new ItemStock({
      item,
      category,
      supplier,
      store,
      quantity,
      purchasePrice,
      purchaseDate,
      document,
      description,
      addedBy: adminID
    });

    await newItemStock.save();
    res.status(201).json({ success: true, itemStock: newItemStock });
  } catch (error) {
    console.error('Error in addItemStock:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get All Item Stocks for a specific Admin
exports.getAllItemStocks = async (req, res) => {
  try {
    const { adminID } = req.query;

    const itemStocks = await ItemStock.find({ addedBy: adminID })
      .populate('item', 'item')          // populate item field
      .populate('category', 'category')  // populate category field
      .populate('supplier', 'name')      // populate supplier name
      .populate('store', 'storeName')    // populate store name
      .lean();

    res.status(200).json(itemStocks);
  } catch (error) {
    console.error('Error in getAllItemStocks:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get Item Stock by ID
exports.getItemStockById = async (req, res) => {
  try {
    const itemStock = await ItemStock.findById(req.params.id)
      .populate('item', 'item')
      .populate('category', 'category')
      .populate('supplier', 'name')
      .populate('store', 'storeName');

    if (!itemStock) {
      return res.status(404).json({ error: 'ItemStock not found' });
    }

    res.status(200).json(itemStock);
  } catch (error) {
    console.error('Error in getItemStockById:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update Item Stock
exports.updateItemStock = async (req, res) => {
  try {
    const {
      item,
      category,
      supplier,
      store,
      quantity,
      purchasePrice,
      purchaseDate,
      document,
      description
    } = req.body;

    const updatedItemStock = await ItemStock.findByIdAndUpdate(
      req.params.id,
      {
        item,
        category,
        supplier,
        store,
        quantity,
        purchasePrice,
        purchaseDate,
        document,
        description
      },
      { new: true }
    )
      .populate('item', 'item')
      .populate('category', 'category')
      .populate('supplier', 'name')
      .populate('store', 'storeName');

    if (!updatedItemStock) {
      return res.status(404).json({ error: 'ItemStock not found' });
    }

    res.status(200).json(updatedItemStock);
  } catch (error) {
    console.error('Error in updateItemStock:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete Item Stock
exports.deleteItemStock = async (req, res) => {
  try {
    const { adminID } = req.body;

    const deletedItemStock = await ItemStock.findOneAndDelete({
      _id: req.params.id,
      addedBy: adminID
    });

    if (!deletedItemStock) {
      return res.status(404).json({ error: 'ItemStock not found or not authorized' });
    }

    res.status(200).json({ message: 'ItemStock deleted successfully' });
  } catch (error) {
    console.error('Error in deleteItemStock:', error);
    res.status(500).json({ error: error.message });
  }
};
