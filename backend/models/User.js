const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say']
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['customer', 'admin', 'manager'],
    default: 'customer',
    index: true
  },
  preferences: {
    department: {
      type: String,
      enum: ['Men', 'Women', 'Both'],
      default: 'Both'
    },
    categories: [String],
    brands: [String],
    priceRange: {
      min: {
        type: Number,
        default: 0
      },
      max: {
        type: Number,
        default: 1000
      }
    },
    size: String,
    newsletter: {
      type: Boolean,
      default: true
    }
  },
  addresses: [{
    type: {
      type: String,
      enum: ['home', 'work', 'other'],
      default: 'home'
    },
    firstName: String,
    lastName: String,
    company: String,
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
    },
    isDefault: {
      type: Boolean,
      default: false
    }
  }],
  lastLogin: {
    type: Date
  },
  loginCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret.password;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for default address
userSchema.virtual('defaultAddress').get(function () {
  return this.addresses.find(addr => addr.isDefault) || this.addresses[0];
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ 'preferences.department': 1 });

module.exports = mongoose.model('User', userSchema);
