const Router = require('express')
const router = Router()
const categoryController = require('../controllers/categoryController')

router.get('/', categoryController.getAllCategories)
router.get('/:id', categoryController.getOneCategory)
router.post('/', categoryController.createCategory)
router.put('/:id', categoryController.updateCategory)
router.delete('/:id', categoryController.deleteCategory)


module.exports = router