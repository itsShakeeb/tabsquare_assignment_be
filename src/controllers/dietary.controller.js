const dietaryService = require('../services/dietary.service');

const createDietaryController = async (req, res) => {
    const { name } = req.body
    const body = { name }
    try {
        const dietary = await dietaryService.createDietary(body);
        res.status(201).json(dietary);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getAllDietariesController = async (req, res) => {
    try {
        const dietaries = await dietaryService.getAllDietaries();
        res.status(200).json(dietaries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getDietaryByIdController = async (req, res) => {
    const { id } = req.params
    try {
        const dietary = await dietaryService.getDietaryById(id);
        res.status(200).json(dietary);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateDietaryController = async (req, res) => {
    const { id } = req.params
    const { name } = req.body
    const body = { name }
    try {
        const dietary = await dietaryService.updateDietary(id, body);
        res.status(200).json(dietary);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteDietaryController = async (req, res) => {
    const { id } = req.params
    try {
        const dietary = await dietaryService.deleteDietary(id);
        res.status(200).json(dietary);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createDietaryController,
    getAllDietariesController,
    getDietaryByIdController,
    updateDietaryController,
    deleteDietaryController
}
