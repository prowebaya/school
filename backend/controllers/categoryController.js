const mongoose = require('mongoose');
const Category = require('../models/Category');
const { sanitize } = require('express-mongo-sanitize');

const sendResponse = (res, status, message, data = null, count = null) => {
  const response = { message };
  if (data !== null) response.data = data;
  if (count !== null) response.count = count;
  return res.status(status).json(response);
};

// Generate a unique categoryId
const generateCategoryId = async (schoolId) => {
  const lastCategory = await Category.findOne({ school: schoolId })
    .sort({ categoryId: -1 })
    .lean();
  return lastCategory ? lastCategory.categoryId + 1 : 1;
};

// Fetch all categories
exports.getAllCategories = async (req, res) => {
  try {
    const { adminID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return sendResponse(res, 400, 'Invalid admin ID format');
    }

    const categories = await Category.find({ school: new mongoose.Types.ObjectId(adminID) })
      .sort({ name: 1 })
      .lean()
      .select('categoryId name');

    const formattedCategories = categories.map(cat => ({
      id: cat.categoryId,
      name: cat.name,
      _id: cat._id, // Include MongoDB ID for deletion
    }));

    return sendResponse(res, 200, 'Categories fetched successfully', formattedCategories, formattedCategories.length);
  } catch (error) {
    console.error('Error fetching categories:', error.message, error.stack);
    return sendResponse(res, 500, `Server error while fetching categories: ${error.message}`);
  }
};

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { adminID } = req.params;
    const { name } = sanitize(req.body);

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return sendResponse(res, 400, 'Invalid admin ID format');
    }

    if (!name || name.trim() === '') {
      return sendResponse(res, 400, 'Category name is required');
    }

    // Check for duplicate category
    const existingCategory = await Category.findOne({
      school: new mongoose.Types.ObjectId(adminID),
      name: { $regex: `^${name.trim()}$`, $options: 'i' },
    });

    if (existingCategory) {
      return sendResponse(res, 400, 'Category already exists');
    }

    const categoryId = await generateCategoryId(new mongoose.Types.ObjectId(adminID));

    const newCategory = new Category({
      name: name.trim(),
      categoryId,
      school: new mongoose.Types.ObjectId(adminID),
    });

    await newCategory.save();

    return sendResponse(res, 201, 'Category created successfully', {
      id: newCategory.categoryId,
      name: newCategory.name,
      _id: newCategory._id,
    });
  } catch (error) {
    console.error('Error creating category:', error.message, error.stack);
    return sendResponse(res, 500, `Server error while creating category: ${error.message}`);
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const { adminID, categoryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(adminID)) {
      return sendResponse(res, 400, 'Invalid admin ID format');
    }

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return sendResponse(res, 400, 'Invalid category ID format');
    }

    const result = await Category.deleteOne({
      _id: new mongoose.Types.ObjectId(categoryId),
      school: new mongoose.Types.ObjectId(adminID),
    });

    if (result.deletedCount === 0) {
      return sendResponse(res, 404, 'Category not found');
    }

    return sendResponse(res, 200, 'Category deleted successfully');
  } catch (error) {
    console.error('Error deleting category:', error.message, error.stack);
    return sendResponse(res, 500, `Server error while deleting category: ${error.message}`);
  }
};