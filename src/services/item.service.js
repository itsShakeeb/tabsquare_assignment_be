const itemRepo = require('../repositories/item.repo');

const createItem = async (body) => {
    try {
        const existingItem = await itemRepo.getItemByName(body.name);

        if (existingItem.rows.length > 0) {
            throw new Error('Item already exists');
        }
        const item = await itemRepo.createItem(body);
        return item.rows[0];
    } catch (error) {
        throw error;
    }
}

const getAllItems = async (filters) => {
    try {
        const items = await itemRepo.getAllItems(filters);
        return items.rows;
    } catch (error) {
        throw error;
    }
}

const getItemById = async (id) => {
    try {
        const item = await itemRepo.getItemById(id);
        return item.rows[0];
    } catch (error) {
        throw error;
    }
}

const updateItem = async (id, body) => {
    try {
        const item = await itemRepo.updateItem(id, body);
        return item.rows[0];
    } catch (error) {
        throw error;
    }
}

const deleteItem = async (id) => {
    try {
        const item = await itemRepo.deleteItem(id);
        return item.rows[0];
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createItem,
    getAllItems,
    getItemById,
    updateItem,
    deleteItem
}
