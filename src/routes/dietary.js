const express = require('express');
const { createDietaryController, getAllDietariesController, getDietaryByIdController, updateDietaryController, deleteDietaryController } = require('../controllers/dietary.controller');
const { createDietaryValidator, updateDietaryValidator, deleteDietaryValidator } = require('../validators/dietary.validator');
const { auth } = require('../middlewares/auth');
const { isAdmin } = require('../validators/index');

const router = express.Router()

router.post('/', [auth, createDietaryValidator, isAdmin], createDietaryController)
router.get('/', [auth], getAllDietariesController)
router.get('/:id', [auth, isAdmin], getDietaryByIdController)
router.put('/:id', [auth, updateDietaryValidator, isAdmin], updateDietaryController)
router.delete('/:id', [auth, deleteDietaryValidator, isAdmin], deleteDietaryController)

module.exports = router
