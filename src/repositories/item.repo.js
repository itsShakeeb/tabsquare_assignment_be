const { query } = require('../config/db.conf');

const createItem = (body) => {
    const { name, description, image, base_price, preparation_time, is_available = true, category_id } = body;
    return query(
        `INSERT INTO item (name, description, image, base_price, preparation_time, is_available, category_id) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         RETURNING id, name, description, image, base_price, preparation_time, is_available, category_id`,
        [name, description, image, base_price, preparation_time, is_available, category_id]
    )
}

const getItemByName = (name) => {
    return query("SELECT * FROM item WHERE name = $1", [name])
}

const getAllItems = (filters = {}) => {
    let baseQuery = `
        SELECT DISTINCT i.* 
        FROM item i
    `;

    const queryParams = [];
    const conditions = [];
    let paramIndex = 1;

    if (filters.dietary && filters.dietary.length > 0) {
        baseQuery += `
            LEFT JOIN item_dietary id ON i.id = id.item_id
            LEFT JOIN dietary d ON id.dietary_id = d.id
        `;

        const dietaryNames = Array.isArray(filters.dietary) ? filters.dietary : [filters.dietary];
        const dietaryPlaceholders = dietaryNames.map(() => `$${paramIndex++}`).join(', ');
        conditions.push(`d.name IN (${dietaryPlaceholders})`);
        queryParams.push(...dietaryNames);
    }

    if (filters.name) {
        conditions.push(`i.name ILIKE $${paramIndex++}`);
        queryParams.push(`%${filters.name}%`);
    }

    if (filters.category_id) {
        conditions.push(`i.category_id = $${paramIndex++}`);
        queryParams.push(filters.category_id);
    }

    if (filters.min_price !== undefined) {
        conditions.push(`i.base_price >= $${paramIndex++}`);
        queryParams.push(filters.min_price);
    }

    if (filters.max_price !== undefined) {
        conditions.push(`i.base_price <= $${paramIndex++}`);
        queryParams.push(filters.max_price);
    }

    if (conditions.length > 0) {
        baseQuery += ` WHERE ` + conditions.join(' AND ');
    }

    return query(baseQuery, queryParams);
}

const getItemById = (id) => {
    return query("SELECT * FROM item WHERE id = $1", [id])
}

const updateItem = (id, body) => {
    const { name, description, image, base_price, preparation_time, is_available, category_id } = body;
    let updateQuery = "UPDATE item SET ";
    const updateValues = [];
    let paramIndex = 1;

    if (name !== undefined) {
        updateQuery += `name = $${paramIndex}, `;
        updateValues.push(name);
        paramIndex++;
    }
    if (description !== undefined) {
        updateQuery += `description = $${paramIndex}, `;
        updateValues.push(description);
        paramIndex++;
    }
    if (image !== undefined) {
        updateQuery += `image = $${paramIndex}, `;
        updateValues.push(image);
        paramIndex++;
    }
    if (base_price !== undefined) {
        updateQuery += `base_price = $${paramIndex}, `;
        updateValues.push(base_price);
        paramIndex++;
    }
    if (preparation_time !== undefined) {
        updateQuery += `preparation_time = $${paramIndex}, `;
        updateValues.push(preparation_time);
        paramIndex++;
    }
    if (is_available !== undefined) {
        updateQuery += `is_available = $${paramIndex}, `;
        updateValues.push(is_available);
        paramIndex++;
    }
    if (category_id !== undefined) {
        updateQuery += `category_id = $${paramIndex}, `;
        updateValues.push(category_id);
        paramIndex++;
    }

    // Remove trailing comma and space
    updateQuery = updateQuery.slice(0, -2);

    updateQuery += ` WHERE id = $${paramIndex} RETURNING *`;
    updateValues.push(id);

    return query(updateQuery, updateValues);
}

const deleteItem = (id) => {
    return query("DELETE FROM item WHERE id = $1 RETURNING id, name", [id])
}

module.exports = {
    createItem,
    getItemByName,
    getAllItems,
    getItemById,
    updateItem,
    deleteItem
}
