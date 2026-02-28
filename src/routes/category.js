const express = require('express');
const { createCategoryController, getAllCategoriesController, getCategoryByIdController, updateCategoryController, deleteCategoryController } = require('../controllers/category.controller');
const { createCategoryValidator, updateCategoryValidator, deleteCategoryValidator } = require('../validators/category.validator');
const { auth } = require('../middlewares/auth');
const { isAdmin } = require('../validators/index');

const router = express.Router()

router.post('/', [auth, createCategoryValidator, isAdmin], createCategoryController)
router.get('/', [auth], getAllCategoriesController)
router.get('/:id', [auth, isAdmin], getCategoryByIdController)
router.put('/:id', [auth, updateCategoryValidator, isAdmin], updateCategoryController)
router.delete('/:id', [auth, deleteCategoryValidator, isAdmin], deleteCategoryController)

module.exports = router