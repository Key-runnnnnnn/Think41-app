const mongoose = require('mongoose');

const distributionCenterSchema = new mongoose.Schema({
  centerId: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    addressLine1: {
      type: String,
      required: true
    },
    addressLine2: String,
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true,
      default: 'US'
    }
  },
  contact: {
    phone: String,
    email: String,
    manager: String
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  capacity: {
    type: Number,
    min: 0
  },
  servingRegions: [String],
  operatingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for product count
distributionCenterSchema.virtual('productCount', {
  ref: 'Product',
  localField: 'centerId',
  foreignField: 'distributionCenterId',
  count: true
});

// Virtual for full address
distributionCenterSchema.virtual('fullAddress').get(function () {
  const addr = this.address;
  return `${addr.addressLine1}${addr.addressLine2 ? ', ' + addr.addressLine2 : ''}, ${addr.city}, ${addr.state} ${addr.zipCode}, ${addr.country}`;
});

module.exports = mongoose.model('DistributionCenter', distributionCenterSchema);
