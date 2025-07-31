// Central export file for all models
const Product = require('./Product');
const Category = require('./Category');
const Brand = require('./Brand');
const User = require('./User');
const Cart = require('./Cart');
const Order = require('./Order');
const DistributionCenter = require('./DistributionCenter');
const Review = require('./Review');

module.exports = {
  Product,
  Category,
  Brand,
  User,
  Cart,
  Order,
  DistributionCenter,
  Review
};
