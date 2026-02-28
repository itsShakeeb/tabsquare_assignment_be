const { body, validationResult } = require("express-validator");
const { validate } = require("./index");

const validateUser = [
    body("email").isEmail().withMessage("Valid email is required"),
    body("name").isLength({ min: 3 }).withMessage("name is required"),
    body('phone_no').isLength({ min: 10, max: 10 }).withMessage('phone_no is required'),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 chars long"),
    validate
];

const validateLogin = [
    body("email").isEmail().withMessage("Valid email is required"),
    body('password')
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 chars long"),
    validate
]
module.exports = { validateUser, validateLogin };