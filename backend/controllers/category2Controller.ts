const CategoryCard = require('../models/categoryCardModel');
const mongoose = require('mongoose');

// Create CategoryCard
exports.createCategoryCard = async (req, res) => {
  try {
    console.log("Creating CategoryCard:", req.body);

    const { categoryCard, description, adminID } = req.body;

    if (!categoryCard || !adminID) {
      return res.status(400).json({ message: 'CategoryCard name and Admin ID are required' });
    }

    const existingCategoryCard = await CategoryCard.findOne({ categoryCard, createdBy: adminID });

    if (existingCategoryCard) {
      return res.status(400).json({ message: 'CategoryCard with this name already exists' });
    }

    const newCategoryCard = new CategoryCard({ categoryCard, description, createdBy: adminID });

    await newCategoryCard.save();
    res.status(201).json({ success: true, categoryCard: newCategoryCard });
  } catch (error) {
    console.error("Error in createCategoryCard:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get All CategoryCards
exports.getCategoryCards = async (req, res) => {
  try {
    const { adminID } = req.query;
    const filter = adminID ? { createdBy: new mongoose.Types.ObjectId(adminID) } : {};
    const categoryCards = await CategoryCard.find(filter);
    res.status(200).json(categoryCards);
  } catch (error) {
    console.error("Error in getCategoryCards:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get CategoryCard by ID
exports.getCategoryCardById = async (req, res) => {
  try {
    const categoryCard = await CategoryCard.findById(req.params.id);
    if (!categoryCard) {
      return res.status(404).json({ error: 'CategoryCard not found' });
    }
    res.status(200).json(categoryCard);
  } catch (error) {
    console.error("Error in getCategoryCardById:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update CategoryCard
exports.updateCategoryCard = async (req, res) => {
  try {
    const { categoryCard, description } = req.body;

    const updatedCategoryCard = await CategoryCard.findByIdAndUpdate(
      req.params.id,
      { categoryCard, description },
      { new: true }
    );

    if (!updatedCategoryCard) {
      return res.status(404).json({ error: 'CategoryCard not found' });
    }

    res.status(200).json(updatedCategoryCard);
  } catch (error) {
    console.error("Error in updateCategoryCard:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete CategoryCard
exports.deleteCategoryCard = async (req, res) => {
  try {
    const deleted = await CategoryCard.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'CategoryCard not found' });
    }
    res.status(200).json({ message: 'CategoryCard deleted' });
  } catch (error) {
    console.error("Error in deleteCategoryCard:", error);
    res.status(500).json({ error: error.message });
  }
};