const { query, pool } = require('../config/db.conf');

const getOrdersByUserId = (userId) => {
    return query("SELECT * FROM orders WHERE customer_id = $1 ORDER BY created_at DESC", [userId]);
};

const getAllOrders = () => {
    return query("SELECT * FROM orders ORDER BY created_at DESC");
};

const getOrderById = (orderId) => {
    return query(`
        SELECT 
            o.*,
            u.name as customer_name, u.email, u.phone_no
        FROM orders o
        JOIN users u ON o.customer_id = u.id
        WHERE o.id = $1
    `, [orderId]);
};

const getOrderItems = (orderId) => {
    return query(`
        SELECT 
            oi.id as order_item_id, oi.quantity, oi.size, oi.instruction, oi.price_at_purchase,
            i.id as item_id, i.name as item_name, i.image
        FROM order_items oi
        JOIN item i ON oi.item_id = i.id
        WHERE oi.order_id = $1
    `, [orderId]);
};

const getOrderItemAddOns = (orderItemIds) => {
    if (!orderItemIds || orderItemIds.length === 0) return { rows: [] };

    return query(`
        SELECT 
            oia.order_item_id,
            a.id as add_on_id, a.name, a.price
        FROM order_item_add_ons oia
        JOIN add_ons a ON oia.add_on_id = a.id
        WHERE oia.order_item_id = ANY($1)
    `, [orderItemIds]);
};

const updateOrderStatus = (orderId, status) => {
    return query(
        "UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
        [status, orderId]
    );
};

const createOrderFromCart = async (userId, cartData) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');


        const orderResult = await client.query(`
            INSERT INTO orders (customer_id, status) 
            VALUES ($1, 'received') 
            RETURNING *
        `, [userId]);

        const orderId = orderResult.rows[0].id;

        for (const item of cartData.items) {
            const itemPrice = item.calculated_price.unit_total;

            const orderItemResult = await client.query(`
                INSERT INTO order_items (order_id, item_id, quantity, size, instruction, price_at_purchase)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id
            `, [orderId, item.item_id, item.quantity, item.size, item.instruction, itemPrice]);

            const orderItemId = orderItemResult.rows[0].id;

            if (item.add_ons && item.add_ons.length > 0) {
                const addOnValues = item.add_ons.map(a => `('${orderItemId}', '${a.add_on_id}')`).join(', ');
                await client.query(`
                    INSERT INTO order_item_add_ons (order_item_id, add_on_id)
                    VALUES ${addOnValues}
                `);
            }
        }

        await client.query("DELETE FROM cart_items WHERE cart_id = $1", [cartData.cart_id]);

        await client.query('COMMIT');
        return orderResult.rows[0];

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

module.exports = {
    getOrdersByUserId,
    getAllOrders,
    getOrderById,
    getOrderItems,
    getOrderItemAddOns,
    updateOrderStatus,
    createOrderFromCart
};
