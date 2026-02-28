const express = require('express');
const {
    getCartController,
    addItemToCartController,
    updateCartItemController,
    removeCartItemController
} = require('../controllers/cart.controller');
const {
    addItemToCartValidator,
    updateCartItemValidator,
    removeCartItemValidator
} = require('../validators/cart.validator');
const { auth } = require('../middlewares/auth');

const router = express.Router();

router.get('/', [auth], getCartController);
router.post('/items', [auth, addItemToCartValidator], addItemToCartController);
router.put('/items/:cartItemId', [auth, updateCartItemValidator], updateCartItemController);
router.delete('/items/:cartItemId', [auth, removeCartItemValidator], removeCartItemController);

module.exports = router;
