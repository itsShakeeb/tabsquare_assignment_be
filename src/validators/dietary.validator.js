const { body, param } = require('express-validator');
const { validate } = require('./index');

const createDietaryValidator = [
    body('name').notEmpty().withMessage('Name is required'),
    validate,
];

const updateDietaryValidator = [
    body('name').notEmpty().withMessage('Name is required'),
    param('id').notEmpty().withMessage('Id is required'),
    validate,
];

const deleteDietaryValidator = [
    param('id').notEmpty().withMessage('Id is required'),
    validate,
];

module.exports = {
    createDietaryValidator,
    updateDietaryValidator,
    deleteDietaryValidator
}
