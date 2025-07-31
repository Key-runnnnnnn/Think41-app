const mongoose = require('mongoose');
const { Product, Department } = require('../models');
require('dotenv').config();

async function refactorDepartments() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/think41');
    console.log('Connected to MongoDB');

    // Step 1: Extract unique department names from products
    console.log('Step 1: Extracting unique department names from products...');
    const uniqueDepartments = await Product.distinct('department');
    console.log('Found departments:', uniqueDepartments);

    // Step 2: Create department documents
    console.log('Step 2: Creating department documents...');
    const departmentDocs = uniqueDepartments.map(deptName => ({
      name: deptName,
      description: `${deptName}'s department offering a wide range of quality products`,
      isActive: true
    }));

    // Insert departments (using insertMany with ordered: false to handle duplicates)
    try {
      const insertedDepartments = await Department.insertMany(departmentDocs, { ordered: false });
      console.log(`Inserted ${insertedDepartments.length} departments`);
    } catch (error) {
      if (error.code === 11000) {
        console.log('Some departments already exist, continuing...');
      } else {
        throw error;
      }
    }

    // Step 3: Get all departments with their ObjectIds
    console.log('Step 3: Getting department ObjectIds...');
    const departments = await Department.find({});
    const departmentMap = {};
    departments.forEach(dept => {
      departmentMap[dept.name] = dept._id;
    });

    console.log('Department mapping:', departmentMap);

    // Step 4: Update products to reference departments by ObjectId
    console.log('Step 4: Updating products to reference departments...');

    let updateCount = 0;
    const batchSize = 1000;
    const totalProducts = await Product.countDocuments();
    console.log(`Total products to update: ${totalProducts}`);

    for (let skip = 0; skip < totalProducts; skip += batchSize) {
      const products = await Product.find({})
        .select('_id department')
        .skip(skip)
        .limit(batchSize);

      const bulkOps = products.map(product => ({
        updateOne: {
          filter: { _id: product._id },
          update: {
            $set: {
              department: departmentMap[product.department]
            }
          }
        }
      }));

      if (bulkOps.length > 0) {
        const result = await Product.bulkWrite(bulkOps);
        updateCount += result.modifiedCount;
        console.log(`Updated batch: ${updateCount}/${totalProducts} products`);
      }
    }

    console.log(`Successfully updated ${updateCount} products`);

    // Step 5: Verify the migration
    console.log('Step 5: Verifying migration...');
    const sampleProducts = await Product.find({}).populate('department').limit(5);
    console.log('Sample products with populated departments:');
    sampleProducts.forEach(product => {
      console.log(`- ${product.name}: ${product.department?.name || 'No department'}`);
    });

    console.log('Database refactoring completed successfully!');

  } catch (error) {
    console.error('Error during database refactoring:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the migration
if (require.main === module) {
  refactorDepartments();
}

module.exports = refactorDepartments;
