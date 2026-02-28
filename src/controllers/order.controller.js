const orderService = require('../services/order.service');

const placeOrderController = async (req, res) => {
    try {
        const userId = req.user.sub;
        const order = await orderService.checkoutCart(userId);
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyOrdersController = async (req, res) => {
    try {
        const userId = req.user.sub;
        const orders = await orderService.getUserOrders(userId);
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOrderByIdController = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await orderService.getOrderById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllOrdersController = async (req, res) => {
    try {
        const orders = await orderService.getAllOrders();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOrderStatusController = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const { status } = req.body;
        const updatedOrder = await orderService.updateOrderStatus(orderId, status);
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    placeOrderController,
    getMyOrdersController,
    getOrderByIdController,
    getAllOrdersController,
    updateOrderStatusController
};
