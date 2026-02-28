const { query } = require('../config/db.conf');

const createAddOn = (body) => {
    const { name, price } = body;
    return query(`INSERT INTO add_ons (name, price) VALUES ($1, $2) RETURNING id, name, price`, [name, price])
}

const getAddOnByName = (name) => {
    return query("SELECT * FROM add_ons WHERE name = $1", [name])
}

const getAllAddOns = () => {
    return query("SELECT * FROM add_ons")
}

const getAddOnById = (id) => {
    return query("SELECT * FROM add_ons WHERE id = $1", [id])
}

const updateAddOn = (id, body) => {
    const { name, price } = body;
    let updateQuery = "UPDATE add_ons SET ";
    const updateValues = [];
    let paramIndex = 1;

    if (name !== undefined) {
        updateQuery += `name = $${paramIndex}, `;
        updateValues.push(name);
        paramIndex++;
    }
    if (price !== undefined) {
        updateQuery += `price = $${paramIndex}, `;
        updateValues.push(price);
        paramIndex++;
    }

    if (updateValues.length === 0) {
        return query("SELECT * FROM add_ons WHERE id = $1", [id]);
    }

    updateQuery = updateQuery.slice(0, -2);
    updateQuery += ` WHERE id = $${paramIndex} RETURNING *`;
    updateValues.push(id);

    return query(updateQuery, updateValues);
}

const deleteAddOn = (id) => {
    return query("DELETE FROM add_ons WHERE id = $1 RETURNING id, name", [id])
}

module.exports = {
    createAddOn,
    getAddOnByName,
    getAllAddOns,
    getAddOnById,
    updateAddOn,
    deleteAddOn
}
