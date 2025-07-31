const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  brand: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  category: {
    type: String,
    required: true,
    trim: true,
    index: true,
    enum: [
      'Accessories', 'Active', 'Blazers & Jackets', 'Clothing Sets', 'Dresses',
      'Fashion Hoodies & Sweatshirts', 'Intimates', 'Jeans', 'Jumpsuits & Rompers',
      'Leggings', 'Maternity', 'Outerwear & Coats', 'Pants', 'Pants & Capris',
      'Plus', 'Shorts', 'Skirts', 'Sleep & Lounge', 'Socks', 'Socks & Hosiery',
      'Suits', 'Suits & Sport Coats', 'Sweaters', 'Swim', 'Tops & Tees', 'Underwear'
    ]
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true,
    index: true
  },
  cost: {
    type: Number,
    required: true,
    min: 0
  },
  retailPrice: {
    type: Number,
    required: true,
    min: 0,
    index: true
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    index: true
  },
  distributionCenterId: {
    type: Number,
    required: true,
    index: true
  },
  // Additional fields for e-commerce functionality
  description: {
    type: String,
    trim: true
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  sizes: [{
    size: String,
    stock: {
      type: Number,
      default: 0,
      min: 0
    }
  }],
  colors: [String],
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  weight: {
    type: Number,
    min: 0
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  tags: [String],
  rating: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  seoData: {
    metaTitle: String,
    metaDescription: String,
    slug: {
      type: String,
      unique: true,
      sparse: true
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
productSchema.index({ category: 1, department: 1 });
productSchema.index({ brand: 1, category: 1 });
productSchema.index({ retailPrice: 1, category: 1 });
productSchema.index({ name: 'text', description: 'text', brand: 'text' });

// Virtual for profit margin
productSchema.virtual('profitMargin').get(function () {
  return this.retailPrice - this.cost;
});

// Virtual for profit percentage
productSchema.virtual('profitPercentage').get(function () {
  return this.cost > 0 ? ((this.retailPrice - this.cost) / this.cost * 100).toFixed(2) : 0;
});

// Pre-save middleware to generate slug
productSchema.pre('save', function (next) {
  if (this.isModified('name') && !this.seoData.slug) {
    this.seoData.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
      + '-' + this.productId;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
