const cartRepo = require('../repositories/cart.repo');

const getOrCreateCartId = async (userId) => {
    let cartResult = await cartRepo.getCartByUserId(userId);
    if (cartResult.rows.length === 0) {
        cartResult = await cartRepo.createCart(userId);
    }
    return cartResult.rows[0].id;
};

const SIZE_MULTIPLIERS = {
    regular: 1.0,
    medium: 1.25,
    large: 1.5
};
const TAX_RATE = 0.08;

const getCart = async (userId) => {
    const details = await cartRepo.getCartDetails(userId);
    if (!details || details.items.length === 0) {
        return { items: [], subtotal: 0, tax: 0, total: 0 };
    }

    let subtotal = 0;

    const items = details.items.map(item => {
        const basePrice = parseFloat(item.base_price);
        const sizeMultiplier = SIZE_MULTIPLIERS[item.size] || 1;
        const sizeAdjustedPrice = basePrice * sizeMultiplier;

        const addOnsPrice = item.add_ons.reduce((sum, addOn) => sum + parseFloat(addOn.price), 0);
        const itemTotal = (sizeAdjustedPrice + addOnsPrice) * item.quantity;

        subtotal += itemTotal;

        return {
            ...item,
            calculated_price: {
                base: basePrice,
                size_adjusted: sizeAdjustedPrice,
                add_ons_total: addOnsPrice,
                unit_total: sizeAdjustedPrice + addOnsPrice,
                quantity_total: itemTotal
            }
        };
    });

    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    return {
        cart_id: details.cart_id,
        items,
        summary: {
            subtotal: parseFloat(subtotal.toFixed(2)),
            tax: parseFloat(tax.toFixed(2)),
            total: parseFloat(total.toFixed(2))
        }
    };
};

const addItemToCart = async (userId, body) => {
    const cartId = await getOrCreateCartId(userId);
    await cartRepo.addItemToCart(cartId, body);
    return getCart(userId);
};

const updateCartItem = async (userId, cartItemId, body) => {
    await cartRepo.updateCartItem(cartItemId, body);
    return getCart(userId);
};

const removeCartItem = async (userId, cartItemId) => {
    await cartRepo.removeCartItem(cartItemId);
    return getCart(userId);
};

module.exports = {
    getCart,
    addItemToCart,
    updateCartItem,
    removeCartItem
};
