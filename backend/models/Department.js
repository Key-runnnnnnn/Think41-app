const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
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
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  seoData: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create slug before saving
departmentSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-');

    // Generate SEO data if not provided
    if (!this.seoData.metaTitle) {
      this.seoData.metaTitle = `${this.name} - Think41 Store`;
    }
    if (!this.seoData.metaDescription) {
      this.seoData.metaDescription = `Shop ${this.name} products at Think41 Store. High quality items with great prices.`;
    }
  }
  next();
});

// Virtual for product count
departmentSchema.virtual('productCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'department',
  count: true
});

// Index for text search
departmentSchema.index({
  name: 'text',
  description: 'text'
});

module.exports = mongoose.model('Department', departmentSchema);
