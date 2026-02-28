const cartService = require('../services/cart.service');

const getCartController = async (req, res) => {
    try {
        const userId = req.user.sub;
        const cart = await cartService.getCart(userId);
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addItemToCartController = async (req, res) => {
    try {
        const userId = req.user.sub;
        const cart = await cartService.addItemToCart(userId, req.body);
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCartItemController = async (req, res) => {
    try {
        const userId = req.user.sub;
        const cartItemId = req.params.cartItemId;
        const cart = await cartService.updateCartItem(userId, cartItemId, req.body);
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const removeCartItemController = async (req, res) => {
    try {
        const userId = req.user.sub;
        const cartItemId = req.params.cartItemId;
        const cart = await cartService.removeCartItem(userId, cartItemId);
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCartController,
    addItemToCartController,
    updateCartItemController,
    removeCartItemController
};
