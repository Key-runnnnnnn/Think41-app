const { Category } = require('../models');

// Get all categories
const getCategories = async (req, res) => {
  try {
    const { department, isActive = true } = req.query;

    const filter = {};
    if (department) filter.department = department;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const categories = await Category.find(filter)
      .populate('productCount')
      .sort({ sortOrder: 1, name: 1 })
      .select('-__v');

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
};

// Get category by ID or slug
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findOne({
      $or: [
        { _id: id },
        { 'seoData.slug': id }
      ],
      isActive: true
    })
      .populate('productCount')
      .populate('subcategories')
      .select('-__v');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching category',
      error: error.message
    });
  }
};

// Create new category (Admin only)
const createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating category',
      error: error.message
    });
  }
};

// Update category (Admin only)
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating category',
      error: error.message
    });
  }
};

// Delete category (Admin only)
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting category',
      error: error.message
    });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
