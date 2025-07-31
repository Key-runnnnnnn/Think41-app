const { Brand } = require('../models');

// Get all brands
const getBrands = async (req, res) => {
  try {
    const { isActive = true, search, limit, page = 1 } = req.query;

    const filter = {};
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    let query = Brand.find(filter)
      .populate('productCount')
      .sort({ name: 1 })
      .select('-__v');

    if (limit) {
      const skip = (page - 1) * limit;
      query = query.skip(skip).limit(parseInt(limit));
    }

    const brands = await query;
    const total = await Brand.countDocuments(filter);

    res.json({
      success: true,
      data: brands,
      pagination: limit ? {
        currentPage: parseInt(page),
        totalItems: total,
        itemsPerPage: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      } : undefined
    });
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching brands',
      error: error.message
    });
  }
};

// Get brand by ID or slug
const getBrandById = async (req, res) => {
  try {
    const { id } = req.params;

    const brand = await Brand.findOne({
      $or: [
        { _id: id },
        { 'seoData.slug': id }
      ],
      isActive: true
    })
      .populate('productCount')
      .select('-__v');

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }

    res.json({
      success: true,
      data: brand
    });
  } catch (error) {
    console.error('Error fetching brand:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching brand',
      error: error.message
    });
  }
};

// Create new brand (Admin only)
const createBrand = async (req, res) => {
  try {
    const brand = new Brand(req.body);
    await brand.save();

    res.status(201).json({
      success: true,
      message: 'Brand created successfully',
      data: brand
    });
  } catch (error) {
    console.error('Error creating brand:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating brand',
      error: error.message
    });
  }
};

// Update brand (Admin only)
const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }

    res.json({
      success: true,
      message: 'Brand updated successfully',
      data: brand
    });
  } catch (error) {
    console.error('Error updating brand:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating brand',
      error: error.message
    });
  }
};

// Delete brand (Admin only)
const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }

    res.json({
      success: true,
      message: 'Brand deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting brand:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting brand',
      error: error.message
    });
  }
};

module.exports = {
  getBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand
};
