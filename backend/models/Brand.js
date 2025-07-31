const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
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
  logo: {
    url: String,
    alt: String
  },
  website: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  country: {
    type: String,
    trim: true
  },
  establishedYear: {
    type: Number,
    min: 1800,
    max: new Date().getFullYear()
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

// Virtual for product count
brandSchema.virtual('productCount', {
  ref: 'Product',
  localField: 'name',
  foreignField: 'brand',
  count: true
});

// Pre-save middleware to generate slug
brandSchema.pre('save', function (next) {
  if (this.isModified('name') && !this.seoData.slug) {
    this.seoData.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

module.exports = mongoose.model('Brand', brandSchema);
