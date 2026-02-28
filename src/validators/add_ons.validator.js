const { body, param } = require('express-validator');
const { validate } = require('./index');

const createAddOnValidator = [
    body('name').notEmpty().withMessage('Name is required'),
    body('price')
        .notEmpty().withMessage('Price is required')
        .isNumeric().withMessage('Price must be a number'),
    validate,
];

const updateAddOnValidator = [
    param('id').notEmpty().withMessage('Id is required'),
    body('price')
        .optional()
        .isNumeric().withMessage('Price must be a number'),
    validate,
];

const deleteAddOnValidator = [
    param('id').notEmpty().withMessage('Id is required'),
    validate,
];

module.exports = {
    createAddOnValidator,
    updateAddOnValidator,
    deleteAddOnValidator
}
