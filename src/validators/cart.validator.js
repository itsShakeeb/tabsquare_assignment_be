const { body, param } = require('express-validator');
const { validate } = require('./index');

const addItemToCartValidator = [
    body('item_id').notEmpty().isUUID().withMessage('Valid Item ID is required'),
    body('quantity').notEmpty().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('size').optional().isIn(['regular', 'medium', 'large']).withMessage('Invalid size'),
    body('add_on_ids').optional().isArray().withMessage('Add-on IDs must be an array'),
    body('add_on_ids.*').isUUID().withMessage('Invalid add-on ID format'),
    validate,
];

const updateCartItemValidator = [
    param('cartItemId').notEmpty().isUUID().withMessage('Valid Cart Item ID is required'),
    body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('size').optional().isIn(['regular', 'medium', 'large']).withMessage('Invalid size'),
    body('add_on_ids').optional().isArray().withMessage('Add-on IDs must be an array'),
    body('add_on_ids.*').isUUID().withMessage('Invalid add-on ID format'),
    validate,
];

const removeCartItemValidator = [
    param('cartItemId').notEmpty().isUUID().withMessage('Valid Cart Item ID is required'),
    validate,
];

module.exports = {
    addItemToCartValidator,
    updateCartItemValidator,
    removeCartItemValidator
};
