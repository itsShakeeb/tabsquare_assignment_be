const categoryRepo = require('../repositories/category.repo');

const createCategory = async (body) => {
    const { name } = body
    try {
        const existingCategory = await categoryRepo.getCategoryByName(name);

        if (existingCategory.rows.length > 0) {
            throw new Error('Category already exists');
        }
        const category = await categoryRepo.createCategory(name);
        return category.rows[0];
    } catch (error) {
        throw error;
    }
}

const getAllCategories = async () => {
    try {
        const categories = await categoryRepo.getAllCategories();
        return categories.rows;
    } catch (error) {
        throw error;
    }
}

const getCategoryById = async (id) => {
    try {
        const category = await categoryRepo.getCategoryById(id);
        return category.rows[0];
    } catch (error) {
        throw error;
    }
}

const updateCategory = async (id, body) => {
    const { name } = body
    try {
        const category = await categoryRepo.updateCategory(id, name);
        return category.rows[0];
    } catch (error) {
        throw error;
    }
}

const deleteCategory = async (id) => {
    try {
        const category = await categoryRepo.deleteCategory(id);
        return category.rows[0];
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
}