const { body, validationResult } = require("express-validator");

const validateUser = [
    body("email").isEmail().withMessage("Valid email is required"),
    body("name").isLength({ min: 3 }).withMessage("name is required"),
    body('phone_no').isLength({ min: 10, max: 10 }).withMessage('phone_no is required'),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 chars long"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        next();
    },
];

const validateLogin = [
    body("email").isEmail().withMessage("Valid email is required"),
    body('password')
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 chars long"),
    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: errors.array() })
        }
        next()
    }

]
module.exports = { validateUser, validateLogin };