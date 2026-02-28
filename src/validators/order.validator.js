const { body, param } = require('express-validator');
const { validate } = require('./index');

const getOrderByIdValidator = [
    param('orderId').notEmpty().isUUID().withMessage('Valid Order ID is required'),
    validate,
];

const updateOrderStatusValidator = [
    param('orderId').notEmpty().isUUID().withMessage('Valid Order ID is required'),
    body('status').notEmpty().isIn(['received', 'preparing', 'ready', 'completed']).withMessage('Invalid status'),
    validate,
];

module.exports = {
    getOrderByIdValidator,
    updateOrderStatusValidator
};
