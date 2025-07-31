const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  images: [{
    url: String,
    alt: String
  }],
  isVerifiedPurchase: {
    type: Boolean,
    default: false,
    index: true
  },
  isApproved: {
    type: Boolean,
    default: false,
    index: true
  },
  helpfulCount: {
    type: Number,
    default: 0,
    min: 0
  },
  size: String,
  color: String,
  fit: {
    type: String,
    enum: ['too_small', 'small', 'perfect', 'large', 'too_large']
  },
  quality: {
    type: Number,
    min: 1,
    max: 5
  },
  value: {
    type: Number,
    min: 1,
    max: 5
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes
reviewSchema.index({ product: 1, rating: -1 });
reviewSchema.index({ user: 1, product: 1 }, { unique: true });
reviewSchema.index({ isApproved: 1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);
