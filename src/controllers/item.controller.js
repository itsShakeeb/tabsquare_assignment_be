const itemService = require('../services/item.service');

const createItemController = async (req, res) => {
    try {
        const item = await itemService.createItem(req.body);
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getAllItemsController = async (req, res) => {
    try {
        const { name, category_id, min_price, max_price, dietary } = req.query;
        const filters = {
            name,
            category_id,
            min_price: min_price ? parseFloat(min_price) : undefined,
            max_price: max_price ? parseFloat(max_price) : undefined,
            dietary
        };
        const items = await itemService.getAllItems(filters);
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getItemByIdController = async (req, res) => {
    const { id } = req.params
    try {
        const item = await itemService.getItemById(id);
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateItemController = async (req, res) => {
    const { id } = req.params
    try {
        const item = await itemService.updateItem(id, req.body);
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteItemController = async (req, res) => {
    const { id } = req.params
    try {
        const item = await itemService.deleteItem(id);
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createItemController,
    getAllItemsController,
    getItemByIdController,
    updateItemController,
    deleteItemController
}