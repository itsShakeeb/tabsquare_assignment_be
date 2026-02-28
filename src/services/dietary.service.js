const dietaryRepo = require('../repositories/dietary.repo');

const createDietary = async (body) => {
    const { name } = body
    try {
        const existingDietary = await dietaryRepo.getDietaryByName(name);

        if (existingDietary.rows.length > 0) {
            throw new Error('Dietary already exists');
        }
        const dietary = await dietaryRepo.createDietary(name);
        return dietary.rows[0];
    } catch (error) {
        throw error;
    }
}

const getAllDietaries = async () => {
    try {
        const dietaries = await dietaryRepo.getAllDietaries();
        return dietaries.rows;
    } catch (error) {
        throw error;
    }
}

const getDietaryById = async (id) => {
    try {
        const dietary = await dietaryRepo.getDietaryById(id);
        return dietary.rows[0];
    } catch (error) {
        throw error;
    }
}

const updateDietary = async (id, body) => {
    const { name } = body
    try {
        const dietary = await dietaryRepo.updateDietary(id, name);
        return dietary.rows[0];
    } catch (error) {
        throw error;
    }
}

const deleteDietary = async (id) => {
    try {
        const dietary = await dietaryRepo.deleteDietary(id);
        return dietary.rows[0];
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createDietary,
    getAllDietaries,
    getDietaryById,
    updateDietary,
    deleteDietary
}
