const { validationResult } = require('express-validator');
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    next();
}

const isAdmin = (req, res, next) => {
    try {
        const { role } = req.user
        if (role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized' })
        }
        next()
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
module.exports = {
    validate,
    isAdmin
}
