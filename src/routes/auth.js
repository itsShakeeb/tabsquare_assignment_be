const express = require('express');
const { createUserController, loginUserController, logoutUserController } = require('../controllers/user.controller');
const { validateUser, validateLogin } = require('../validators/user.validator');
const { auth } = require('../middlewares/auth');

const router = express.Router()

router.post('/', [validateUser], createUserController)
router.post('/login', [validateLogin], loginUserController)
router.post('/logout', [auth], logoutUserController)


module.exports = router