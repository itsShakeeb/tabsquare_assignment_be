const express = require('express');
const { createAddOnController, getAllAddOnsController, getAddOnByIdController, updateAddOnController, deleteAddOnController } = require('../controllers/add_ons.controller');
const { createAddOnValidator, updateAddOnValidator, deleteAddOnValidator } = require('../validators/add_ons.validator');
const { auth } = require('../middlewares/auth');
const { isAdmin } = require('../validators/index');

const router = express.Router()

router.post('/', [auth, createAddOnValidator, isAdmin], createAddOnController)
router.get('/', [auth], getAllAddOnsController)
router.get('/:id', [auth], getAddOnByIdController)
router.put('/:id', [auth, updateAddOnValidator, isAdmin], updateAddOnController)
router.delete('/:id', [auth, deleteAddOnValidator, isAdmin], deleteAddOnController)

module.exports = router
