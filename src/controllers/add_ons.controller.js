const addOnService = require('../services/add_ons.service');

const createAddOnController = async (req, res) => {
    try {
        const addOn = await addOnService.createAddOn(req.body);
        res.status(201).json(addOn);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getAllAddOnsController = async (req, res) => {
    try {
        const addOns = await addOnService.getAllAddOns();
        res.status(200).json(addOns);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getAddOnByIdController = async (req, res) => {
    const { id } = req.params;
    try {
        const addOn = await addOnService.getAddOnById(id);
        res.status(200).json(addOn);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateAddOnController = async (req, res) => {
    const { id } = req.params;
    try {
        const addOn = await addOnService.updateAddOn(id, req.body);
        res.status(200).json(addOn);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteAddOnController = async (req, res) => {
    const { id } = req.params;
    try {
        const addOn = await addOnService.deleteAddOn(id);
        res.status(200).json(addOn);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createAddOnController,
    getAllAddOnsController,
    getAddOnByIdController,
    updateAddOnController,
    deleteAddOnController
}
