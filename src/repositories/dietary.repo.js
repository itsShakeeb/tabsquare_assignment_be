const { query } = require('../config/db.conf');

const createDietary = (name) => {
    return query(`INSERT INTO dietary (name) VALUES ($1) RETURNING id, name`, [name])
}

const getDietaryByName = (name) => {
    return query("SELECT * FROM dietary WHERE name = $1", [name])
}

const getAllDietaries = () => {
    return query("SELECT * FROM dietary")
}

const getDietaryById = (id) => {
    return query("SELECT * FROM dietary WHERE id = $1", [id])
}

const updateDietary = (id, name) => {
    return query("UPDATE dietary SET name = $1 WHERE id = $2 RETURNING id, name", [name, id])
}

const deleteDietary = (id) => {
    return query("DELETE FROM dietary WHERE id = $1 RETURNING id, name", [id])
}

module.exports = {
    createDietary,
    getDietaryByName,
    getAllDietaries,
    getDietaryById,
    updateDietary,
    deleteDietary
}
