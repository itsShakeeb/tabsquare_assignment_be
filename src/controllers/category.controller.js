const categoryService = require('../services/category.service');

const createCategoryController = async (req, res) => {
    const { name } = req.body
    const body = { name }
    try {
        const category = await categoryService.createCategory(body);
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getAllCategoriesController = async (req, res) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getCategoryByIdController = async (req, res) => {
    const { id } = req.params
    try {
        const category = await categoryService.getCategoryById(id);
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateCategoryController = async (req, res) => {
    const { id } = req.params
    const { name } = req.body
    const body = { name }
    try {
        const category = await categoryService.updateCategory(id, body);
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteCategoryController = async (req, res) => {
    const { id } = req.params
    try {
        const category = await categoryService.deleteCategory(id);
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createCategoryController,
    getAllCategoriesController,
    getCategoryByIdController,
    updateCategoryController,
    deleteCategoryController
}