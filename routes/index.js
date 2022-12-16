const Router = require('express')
const router = Router()

const categoriesRouter = require('./categoriesRouter')
const productsRouter = require('./productsRouter')
const ordersRouter = require('./ordersRouter')
const usersRouter = require('./usersRouter')

router.use('/categories', categoriesRouter)
router.use('/products', productsRouter)
router.use('/orders', ordersRouter)
router.use('/users', usersRouter)

module.exports = router