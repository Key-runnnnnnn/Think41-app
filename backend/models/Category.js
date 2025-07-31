const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    required: true,
    enum: ['Men', 'Women', 'Unisex'],
    index: true
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  image: {
    url: String,
    alt: String
  },
  seoData: {
    metaTitle: String,
    metaDescription: String,
    slug: {
      type: String,
      unique: true
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for subcategories
categorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parentCategory'
});

// Virtual for product count
categorySchema.virtual('productCount', {
  ref: 'Product',
  localField: 'name',
  foreignField: 'category',
  count: true
});

// Pre-save middleware to generate slug
categorySchema.pre('save', function (next) {
  if (this.isModified('name') && !this.seoData.slug) {
    this.seoData.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);
