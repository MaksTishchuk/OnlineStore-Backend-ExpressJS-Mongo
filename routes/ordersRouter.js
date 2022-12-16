const Router = require('express')
const router = Router()
const orderController = require('../controllers/orderController')

router.get('/', orderController.getAllOrders)
router.get('/:id', orderController.getOneOrder)
router.post('/', orderController.createOrder)
router.put('/:id', orderController.updateOrder)
router.delete('/:id', orderController.deleteOrder)
router.get('/get/total-sales', orderController.getTotalSales)
router.get('/get/count', orderController.getOrdersCount)
router.get('/get/user-orders/:userid', orderController.getUserOrders)


module.exports = router