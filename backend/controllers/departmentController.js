const mongoose = require('mongoose');
const { Department, Product } = require('../models');

// Get all departments with optional filtering and pagination
const getDepartments = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      isActive = 'true',
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;

    
    // Build filter object
    const filter = {};

    if (isActive !== 'all') {
      filter.isActive = isActive === 'true';
    }

    // Search functionality
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const departments = await Department.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('productCount')
      .select('-__v');

    const total = await Department.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: departments,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching departments',
      error: error.message
    });
  }
};

// Get single department by ID or slug
const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;

    // Build search conditions
    const searchConditions = [
      { slug: id.toLowerCase() }
    ];

    // Only add ObjectId condition if id is a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      searchConditions.unshift({ _id: id });
    }

    const department = await Department.findOne({
      $or: searchConditions,
      isActive: true
    })
      .populate('productCount')
      .select('-__v');

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    res.json({
      success: true,
      data: department
    });
  } catch (error) {
    console.error('Error fetching department:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching department',
      error: error.message
    });
  }
};

// Get products by department
const getProductsByDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      page = 1,
      limit = 20,
      category,
      brand,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Find department first
    let department;
    if (mongoose.Types.ObjectId.isValid(id)) {
      department = await Department.findById(id);
    } else {
      department = await Department.findOne({ slug: id.toLowerCase() });
    }

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    // Build filter for products
    const filter = {
      department: department._id,
      isActive: true
    };

    if (category) filter.category = category;
    if (brand) filter.brand = brand;

    if (minPrice || maxPrice) {
      filter.retailPrice = {};
      if (minPrice) filter.retailPrice.$gte = parseFloat(minPrice);
      if (maxPrice) filter.retailPrice.$lte = parseFloat(maxPrice);
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;
    const products = await Product.find(filter)
      .populate('department', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: products,
      department: {
        _id: department._id,
        name: department.name,
        slug: department.slug
      },
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching products by department:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products by department',
      error: error.message
    });
  }
};

// Create new department (Admin only)
const createDepartment = async (req, res) => {
  try {
    const department = new Department(req.body);
    await department.save();

    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: department
    });
  } catch (error) {
    console.error('Error creating department:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating department',
      error: error.message
    });
  }
};

// Update department (Admin only)
const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    res.json({
      success: true,
      message: 'Department updated successfully',
      data: department
    });
  } catch (error) {
    console.error('Error updating department:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating department',
      error: error.message
    });
  }
};

// Delete department (Admin only)
const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if department has products
    const productCount = await Product.countDocuments({ department: id, isActive: true });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete department. It has ${productCount} active products.`
      });
    }

    const department = await Department.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    res.json({
      success: true,
      message: 'Department deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting department:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting department',
      error: error.message
    });
  }
};

module.exports = {
  getDepartments,
  getDepartmentById,
  getProductsByDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment
};
