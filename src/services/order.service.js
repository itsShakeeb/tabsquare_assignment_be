const orderRepo = require('../repositories/order.repo');
const cartService = require('../services/cart.service');

const checkoutCart = async (userId) => {
    try {
        const cart = await cartService.getCart(userId);

        if (!cart || cart.items.length === 0) {
            throw new Error('Cart is empty. Cannot place order.');
        }

        const newOrder = await orderRepo.createOrderFromCart(userId, cart);

        return getFullOrderDetails(newOrder.id);
    } catch (error) {
        throw error;
    }
};

const getUserOrders = async (userId) => {
    const ordersResult = await orderRepo.getOrdersByUserId(userId);
    return formatMultipleOrders(ordersResult.rows);
};

const getAllOrders = async () => {
    const ordersResult = await orderRepo.getAllOrders();
    return formatMultipleOrders(ordersResult.rows);
};

const getOrderById = async (orderId) => {
    return getFullOrderDetails(orderId);
};

const updateOrderStatus = async (orderId, status) => {
    const result = await orderRepo.updateOrderStatus(orderId, status);
    if (result.rows.length === 0) {
        throw new Error('Order not found');
    }
    return result.rows[0];
};

const getFullOrderDetails = async (orderId) => {
    const orderResult = await orderRepo.getOrderById(orderId);
    if (orderResult.rows.length === 0) return null;

    const order = orderResult.rows[0];

    const itemsResult = await orderRepo.getOrderItems(orderId);
    const orderItems = itemsResult.rows;

    if (orderItems.length > 0) {
        const orderItemIds = orderItems.map(item => item.order_item_id);
        const addOnsResult = await orderRepo.getOrderItemAddOns(orderItemIds);
        const addOns = addOnsResult.rows;

        order.items = orderItems.map(item => ({
            ...item,
            add_ons: addOns.filter(a => a.order_item_id === item.order_item_id)
        }));

        let total = 0;
        order.items.forEach(item => {
            total += parseFloat(item.price_at_purchase) * item.quantity;
        });
        const tax = total * 0.08;
        order.summary = {
            subtotal: parseFloat(total.toFixed(2)),
            tax: parseFloat(tax.toFixed(2)),
            total: parseFloat((total + tax).toFixed(2))
        };
    } else {
        order.items = [];
    }

    return order;
};

const formatMultipleOrders = async (orders) => {
    const fullOrders = [];
    for (const o of orders) {
        const fullDetail = await getFullOrderDetails(o.id);
        fullOrders.push(fullDetail);
    }
    return fullOrders;
};


module.exports = {
    checkoutCart,
    getUserOrders,
    getAllOrders,
    getOrderById,
    updateOrderStatus
};
