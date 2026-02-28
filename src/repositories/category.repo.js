const { query } = require('../config/db.conf');

const createCategory = (name) => {
    return query(`INSERT INTO category (name) VALUES ($1) RETURNING id, name`, [name])
}

const getCategoryByName = (name) => {
    return query("SELECT * FROM category WHERE name = $1", [name])
}

const getAllCategories = () => {
    return query("SELECT * FROM category")
}

const getCategoryById = (id) => {
    return query("SELECT * FROM category WHERE id = $1", [id])
}

const updateCategory = (id, name) => {
    return query("UPDATE category SET name = $1 WHERE id = $2 RETURNING id, name", [name, id])
}

const deleteCategory = (id) => {
    return query("DELETE FROM category WHERE id = $1 RETURNING id, name", [id])
}

module.exports = {
    createCategory,
    getCategoryByName,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
}