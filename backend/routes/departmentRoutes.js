const express = require('express');
const router = express.Router();
const {
  getDepartments,
  getDepartmentById,
  getProductsByDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment
} = require('../controllers/departmentController');

// GET /api/departments - Get all departments
router.get('/', getDepartments);

// GET /api/departments/:id - Get department by ID or slug
router.get('/:id', getDepartmentById);

// GET /api/departments/:id/products - Get products by department
router.get('/:id/products', getProductsByDepartment);

// POST /api/departments - Create new department (Admin only)
router.post('/', createDepartment);

// PUT /api/departments/:id - Update department (Admin only)
router.put('/:id', updateDepartment);

// DELETE /api/departments/:id - Delete department (Admin only)
router.delete('/:id', deleteDepartment);

module.exports = router;
