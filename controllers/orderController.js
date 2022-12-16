const {Product} = require("../models/product");
const {OrderItem} = require("../models/orderItem");
const {Order} = require('../models/order')

const getAllOrders = async (req, res) => {
    try {
        const orderList = await Order.find()
            .populate('user', 'username email phone')
            .populate({
                path: 'orderItems',
                populate: {
                    path: 'product',
                    populate: 'category'
                }
            })
            .sort('-dateOrdered')
        if (!orderList) {
            return res.status(500).json({success: false, message: 'Order List was not found!'})
        }
        res.status(200).json(orderList)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

const getOneOrder = async (req, res) => {
    try {
        const orderId = req.params.id
        const order = await Order.findById(orderId)
            .populate('user', 'username email phone')
            .populate({
                path: 'orderItems',
                populate: {
                    path: 'product',
                    populate: 'category'
                }
            })
        if (!order) {
            return res.status(500).json({success: false, message: 'Order was not found!'})
        }
        res.status(200).json(order)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

const createOrder = async (req, res) => {
    try {
        let orderItemsIdsResolved = []
        let products = []
        let orderItems = []
        let totalPrice = 0

        // Получаем айдишники orderItems.
        // Проверяем, что количество товаров в наличии больше, чем в заказе
        // Считаем общую сумму заказа
        // Список айдишников передаем в конструктор заказа
        for (const item in req.body.orderItems) {
            let newOrderItem = new OrderItem({
                quantity: req.body.orderItems[item].quantity,
                product: req.body.orderItems[item].product
            })
            let product = await Product.findById(req.body.orderItems[item].product).select('countInStock price')
            if ((product.countInStock - req.body.orderItems[item].quantity) >= 0) {
                product.countInStock = product.countInStock - req.body.orderItems[item].quantity
                orderItems.push(newOrderItem)
                products.push(product)
            } else {
                return res.status(500).json({
                    success: false,
                    message: 'Quantity of product in stock less than quantity in order!'
                })
            }
            totalPrice += req.body.orderItems[item].quantity * product.price
            orderItemsIdsResolved.push(newOrderItem._id)
        }

        // Сохраняем в БД orderItems из заказа
        for (const item in orderItems) {
            await orderItems[item].save()
        }

        // Создаем заказ и сохраняем его
        let order = new Order({
            orderItems: orderItemsIdsResolved,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            shippingAddress: req.body.shippingAddress,
            country: req.body.country,
            city: req.body.city,
            zip: req.body.zip,
            phone: req.body.phone,
            status: req.body.status,
            totalPrice: totalPrice,
            user: req.body.user,
        })
        order = await order.save()

        if (!order) {
            return res.status(500).json({success: false, message: 'Order was not created!'})
        }

        // Обновляем количество товаров в БД
        for (const product in products) {
            await products[product].save()
        }

        res.json(order)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

const updateOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            {
                status: req.body.status
            },
            {new: true}
        )

        if (!order) {
            return res.status(500).json({success: false, message: 'Order was not found!'})
        }
        res.status(200).json(order)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

const deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.id
        Order.findByIdAndDelete(orderId,async (err, doc) => {
            if (err) {
                console.log(err)
                return res.status(500).json({success: false, message: 'Something went wrong!'})
            }
            if (!doc) {
                return res.status(404).json({success: false, message: 'Order was not found!'})
            }
            for (const orderItem in doc.orderItems) {
                await OrderItem.findByIdAndDelete(doc.orderItems[orderItem])
            }
            // Альтернатива
            // await doc.orderItems.map(async orderItem => {
            //     await Order.findByIdAndDelete(orderItem)
            // })
            res.json({success: true, message: 'Order was deleted!', doc: doc})
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

const getTotalSales = async (req, res) => {
    try {
        const sales = await Order.aggregate([
            {$group: {_id: null, totalSales: {$sum: '$totalPrice'}}}
        ])

        if (!sales) {
            return res.status(500).json({success: false, message: 'Total sales was not counted!'})
        }
        res.status(200).json({totalSales: sales.pop().totalSales})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

const getOrdersCount = async (req, res) => {
    try {
        const ordersCount = await Order.countDocuments()
        if (!ordersCount) {
            return res.status(500).json({success: false, message: 'Orders was not counted!'})
        }
        res.status(200).json({ordersCount: ordersCount})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

const getUserOrders = async (req, res) => {
    try {
        const userOrdersList = await Order.find({user: req.params.userid}).populate({
            path: 'orderItems', populate: {
                path: 'product', populate: 'category'
            }
        }).sort('-dateOrdered')

        if (!userOrdersList) {
            return res.status(500).json({success: false, message: 'User orders was not found!'})
        }
        res.status(200).json({userOrdersList: userOrdersList})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

module.exports = {
    getAllOrders,
    getOneOrder,
    updateOrder,
    createOrder,
    deleteOrder,
    getTotalSales,
    getOrdersCount,
    getUserOrders
}