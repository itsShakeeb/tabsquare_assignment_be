const express = require('express');
const { createItemController, getAllItemsController, getItemByIdController, updateItemController, deleteItemController } = require('../controllers/item.controller');
const { createItemValidator, updateItemValidator, deleteItemValidator } = require('../validators/item.validator');
const { auth } = require('../middlewares/auth');
const { isAdmin } = require('../validators/index');

const router = express.Router()

router.post('/', [auth, createItemValidator, isAdmin], createItemController)
router.get('/', [auth], getAllItemsController)
router.get('/:id', [auth], getItemByIdController)
router.put('/:id', [auth, updateItemValidator, isAdmin], updateItemController)
router.delete('/:id', [auth, deleteItemValidator, isAdmin], deleteItemController)

module.exports = router
