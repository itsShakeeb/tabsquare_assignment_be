const express = require('express');
const {
    placeOrderController,
    getMyOrdersController,
    getOrderByIdController,
    getAllOrdersController,
    updateOrderStatusController
} = require('../controllers/order.controller');
const {
    getOrderByIdValidator,
    updateOrderStatusValidator
} = require('../validators/order.validator');
const { auth } = require('../middlewares/auth');
const { isAdmin } = require('../validators/index');

const router = express.Router();


router.post('/checkout', [auth], placeOrderController);
router.get('/my-orders', [auth], getMyOrdersController);
router.get('/:orderId', [auth, getOrderByIdValidator], getOrderByIdController);


router.get('/', [auth, isAdmin], getAllOrdersController);
router.put('/:orderId/status', [auth, updateOrderStatusValidator, isAdmin], updateOrderStatusController);

module.exports = router;
