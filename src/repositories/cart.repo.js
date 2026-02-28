const { query, pool } = require('../config/db.conf');

const getCartByUserId = (userId) => {
    return query("SELECT * FROM cart WHERE user_id = $1", [userId]);
};

const createCart = (userId) => {
    return query("INSERT INTO cart (user_id) VALUES ($1) RETURNING *", [userId]);
};

const getCartDetails = async (userId) => {
    const cartResult = await getCartByUserId(userId);
    if (cartResult.rows.length === 0) return null;

    const cartId = cartResult.rows[0].id;

    const cartItemsResult = await query(`
        SELECT 
            ci.id as cart_item_id, ci.quantity, ci.size, ci.instruction,
            i.id as item_id, i.name as item_name, i.base_price, i.image
        FROM cart_items ci
        JOIN item i ON ci.item_id = i.id
        WHERE ci.cart_id = $1
    `, [cartId]);

    const cartItems = cartItemsResult.rows;
    if (cartItems.length === 0) {
        return { cart_id: cartId, items: [] };
    }

    const cartItemIds = cartItems.map(item => item.cart_item_id);


    const addOnsResult = await query(`
        SELECT 
            cia.cart_item_id,
            a.id as add_on_id, a.name, a.price
        FROM cart_item_add_ons cia
        JOIN add_ons a ON cia.add_on_id = a.id
        WHERE cia.cart_item_id = ANY($1)
    `, [cartItemIds]);

    const addOns = addOnsResult.rows;

    const itemsWithAddOns = cartItems.map(item => ({
        ...item,
        add_ons: addOns.filter(a => a.cart_item_id === item.cart_item_id)
    }));

    return {
        cart_id: cartId,
        items: itemsWithAddOns
    };
};

const addItemToCart = async (cartId, body) => {
    const { item_id, quantity, size, instruction, add_on_ids = [] } = body;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const cartItemResult = await client.query(`
            INSERT INTO cart_items (cart_id, item_id, quantity, size, instruction)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `, [cartId, item_id, quantity, size, instruction]);

        const cartItemId = cartItemResult.rows[0].id;

        if (add_on_ids.length > 0) {
            const values = add_on_ids.map(id => `('${cartItemId}', '${id}')`).join(', ');
            await client.query(`INSERT INTO cart_item_add_ons (cart_item_id, add_on_id) VALUES ${values}`);
        }

        await client.query('COMMIT');
        return cartItemResult.rows[0];
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

const updateCartItem = async (cartItemId, body) => {
    const { quantity, size, instruction, add_on_ids } = body;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        let updateQuery = "UPDATE cart_items SET ";
        const updateValues = [];
        let paramIndex = 1;

        if (quantity !== undefined) {
            updateQuery += `quantity = $${paramIndex}, `;
            updateValues.push(quantity);
            paramIndex++;
        }
        if (size !== undefined) {
            updateQuery += `size = $${paramIndex}, `;
            updateValues.push(size);
            paramIndex++;
        }
        if (instruction !== undefined) {
            updateQuery += `instruction = $${paramIndex}, `;
            updateValues.push(instruction);
            paramIndex++;
        }

        if (updateValues.length > 0) {
            updateQuery = updateQuery.slice(0, -2);
            updateQuery += ` WHERE id = $${paramIndex} RETURNING *`;
            updateValues.push(cartItemId);
            await client.query(updateQuery, updateValues);
        }

        if (add_on_ids !== undefined) {
            await client.query("DELETE FROM cart_item_add_ons WHERE cart_item_id = $1", [cartItemId]);
            if (add_on_ids.length > 0) {
                const values = add_on_ids.map(id => `('${cartItemId}', '${id}')`).join(', ');
                await client.query(`INSERT INTO cart_item_add_ons (cart_item_id, add_on_id) VALUES ${values}`);
            }
        }

        await client.query('COMMIT');
        return { success: true };
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

const removeCartItem = (cartItemId) => {
    return query("DELETE FROM cart_items WHERE id = $1 RETURNING *", [cartItemId]);
};

const clearCartItems = (cartId) => {
    return query("DELETE FROM cart_items WHERE cart_id = $1", [cartId]);
};

module.exports = {
    getCartByUserId,
    createCart,
    getCartDetails,
    addItemToCart,
    updateCartItem,
    removeCartItem,
    clearCartItems
};
