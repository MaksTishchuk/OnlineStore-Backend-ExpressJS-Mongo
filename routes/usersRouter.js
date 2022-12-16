const Router = require('express')
const router = Router()
const userController = require('../controllers/userController')

router.get('/', userController.getAllUsers)
router.get('/:id', userController.getUser)
router.post('/', userController.createUser)
router.put('/:id', userController.updateUser)
router.delete('/:id', userController.deleteUser)
router.post('/login', userController.loginUser)
router.post('/register', userController.registerUser)
router.get('/get/count', userController.countUsers)

module.exports = router
