const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const { Product, Category, Brand, DistributionCenter } = require('../models');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

// Import products from CSV
const importProducts = async () => {
  try {
    console.log('🚀 Starting product import...');

    const products = [];
    const categories = new Set();
    const brands = new Set();
    const distributionCenters = new Set();

    // Read and parse CSV file
    const csvPath = path.join(__dirname, '../data/products.csv');

    return new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (row) => {
          // Skip rows with missing required data
          if (!row.id || !row.name || !row.brand || !row.category || !row.department) {
            return;
          }

          // Clean and transform data
          const product = {
            productId: parseInt(row.id),
            name: row.name?.trim(),
            brand: row.brand?.trim(),
            category: row.category?.trim(),
            department: row.department?.trim(),
            cost: parseFloat(row.cost),
            retailPrice: parseFloat(row.retail_price),
            sku: row.sku?.trim().toUpperCase(),
            distributionCenterId: parseInt(row.distribution_center_id),
            isActive: true,
            stock: Math.floor(Math.random() * 100) + 10, // Random stock between 10-110
            description: `${row.name} - High quality ${row.category.toLowerCase()} from ${row.brand}`,
            tags: [row.category.toLowerCase(), row.brand.toLowerCase(), row.department.toLowerCase()],
            seoData: {
              metaTitle: `${row.name} - ${row.brand} | Think41`,
              metaDescription: `Shop ${row.name} from ${row.brand}. High quality ${row.category} for ${row.department}.`
            }
          };

          // Add some sample sizes based on category
          if (['Clothing', 'Dresses', 'Tops & Tees', 'Pants', 'Shorts'].some(cat => row.category.includes(cat))) {
            product.sizes = [
              { size: 'XS', stock: Math.floor(Math.random() * 20) + 5 },
              { size: 'S', stock: Math.floor(Math.random() * 20) + 5 },
              { size: 'M', stock: Math.floor(Math.random() * 20) + 5 },
              { size: 'L', stock: Math.floor(Math.random() * 20) + 5 },
              { size: 'XL', stock: Math.floor(Math.random() * 20) + 5 }
            ];
          }

          products.push(product);

          // Only add to sets if values exist
          if (row.category?.trim()) categories.add(row.category?.trim());
          if (row.brand?.trim()) brands.add(row.brand?.trim());
          if (row.distribution_center_id) distributionCenters.add(parseInt(row.distribution_center_id));
        })
        .on('end', async () => {
          try {
            console.log(`📊 Parsed ${products.length} products`);
            console.log(`📊 Found ${categories.size} categories`);
            console.log(`📊 Found ${brands.size} brands`);
            console.log(`📊 Found ${distributionCenters.size} distribution centers`);

            // Clear existing data
            await Product.deleteMany({});
            await Category.deleteMany({});
            await Brand.deleteMany({});
            await DistributionCenter.deleteMany({});

            console.log('🗑️ Cleared existing data');

            // Insert categories
            const categoryDocs = Array.from(categories).map((name, index) => ({
              name,
              description: `${name} category`,
              department: 'Unisex', // Will be updated based on products
              isActive: true,
              seoData: {
                slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + `-${index}`,
                metaTitle: `${name} | Think41`,
                metaDescription: `Shop the best ${name.toLowerCase()} collection at Think41`
              }
            }));

            await Category.insertMany(categoryDocs);
            console.log('✅ Categories imported');

            // Insert brands
            const brandDocs = Array.from(brands).filter(name => name && name.length > 0).map((name, index) => ({
              name,
              description: `${name} brand`,
              isActive: true,
              seoData: {
                slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + `-${index}`,
                metaTitle: `${name} | Think41`,
                metaDescription: `Shop ${name} products at Think41`
              }
            }));

            await Brand.insertMany(brandDocs);
            console.log('✅ Brands imported');

            // Insert distribution centers
            const distributionCenterDocs = Array.from(distributionCenters).map(centerId => ({
              centerId,
              name: `Distribution Center ${centerId}`,
              address: {
                addressLine1: `${centerId}00 Warehouse St`,
                city: 'Distribution City',
                state: 'CA',
                zipCode: `9000${centerId}`,
                country: 'US'
              },
              isActive: true,
              capacity: 10000,
              servingRegions: ['West Coast', 'East Coast', 'Midwest']
            }));

            await DistributionCenter.insertMany(distributionCenterDocs);
            console.log('✅ Distribution centers imported');

            // Insert products in batches
            const batchSize = 1000;
            for (let i = 0; i < products.length; i += batchSize) {
              const batch = products.slice(i, i + batchSize);
              await Product.insertMany(batch);
              console.log(`✅ Imported batch ${Math.ceil((i + 1) / batchSize)} of ${Math.ceil(products.length / batchSize)}`);
            }

            console.log('🎉 Product import completed successfully!');
            resolve();
          } catch (error) {
            console.error('❌ Error during import:', error);
            reject(error);
          }
        })
        .on('error', (error) => {
          console.error('❌ Error reading CSV:', error);
          reject(error);
        });
    });
  } catch (error) {
    console.error('❌ Import failed:', error);
    throw error;
  }
};

// Main function
const main = async () => {
  try {
    await connectDB();
    await importProducts();
    console.log('✅ All data imported successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Import process failed:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { importProducts, connectDB };
