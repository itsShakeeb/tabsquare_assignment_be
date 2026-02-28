const addOnsRepo = require('../repositories/add_ons.repo');

const createAddOn = async (body) => {
    try {
        const existingAddOn = await addOnsRepo.getAddOnByName(body.name);

        if (existingAddOn.rows.length > 0) {
            throw new Error('Add-on already exists');
        }
        const addOn = await addOnsRepo.createAddOn(body);
        return addOn.rows[0];
    } catch (error) {
        throw error;
    }
}

const getAllAddOns = async () => {
    try {
        const addOns = await addOnsRepo.getAllAddOns();
        return addOns.rows;
    } catch (error) {
        throw error;
    }
}

const getAddOnById = async (id) => {
    try {
        const addOn = await addOnsRepo.getAddOnById(id);
        if (addOn.rows.length === 0) {
            throw new Error('Add-on not found');
        }
        return addOn.rows[0];
    } catch (error) {
        throw error;
    }
}

const updateAddOn = async (id, body) => {
    try {
        const addOn = await addOnsRepo.updateAddOn(id, body);
        return addOn.rows[0];
    } catch (error) {
        throw error;
    }
}

const deleteAddOn = async (id) => {
    try {
        const addOn = await addOnsRepo.deleteAddOn(id);
        return addOn.rows[0];
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createAddOn,
    getAllAddOns,
    getAddOnById,
    updateAddOn,
    deleteAddOn
}
