const { body, param } = require('express-validator');
const { validate } = require('./index');

const createCategoryValidator = [
    body('name').notEmpty().withMessage('Name is required'),
    validate,
];

const updateCategoryValidator = [
    body('name').notEmpty().withMessage('Name is required'),
    param('id').notEmpty().withMessage('Id is required'),
    validate,
];

const deleteCategoryValidator = [
    param('id').notEmpty().withMessage('Id is required'),
    validate,
];



module.exports = {
    createCategoryValidator,
    updateCategoryValidator,
    deleteCategoryValidator
}