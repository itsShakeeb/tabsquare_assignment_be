const { body, param } = require('express-validator');
const { validate } = require('./index');

const createItemValidator = [
    body('name').notEmpty().withMessage('Name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('image_url').notEmpty().withMessage('Image URL is required'),
    body('preparation_time').notEmpty().withMessage('Preparation time is required').isNumeric().withMessage('Preparation time must be a number'),
    body('base_price')
        .notEmpty().withMessage('Base price is required')
        .isNumeric().withMessage('Base price must be a number'),
    body('category_id').notEmpty().withMessage('Category ID is required'),
    body('dietary_ids').optional().isArray().withMessage('Dietary IDs must be an array'),
    validate,
];

const updateItemValidator = [
    param('id').notEmpty().withMessage('Id is required'),
    body('base_price')
        .optional()
        .isNumeric().withMessage('Base price must be a number'),
    body('dietary_ids').optional().isArray().withMessage('Dietary IDs must be an array'),
    validate,
];

const deleteItemValidator = [
    param('id').notEmpty().withMessage('Id is required'),
    validate,
];

module.exports = {
    createItemValidator,
    updateItemValidator,
    deleteItemValidator
}
