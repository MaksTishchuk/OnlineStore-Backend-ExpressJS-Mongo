const Router = require('express')
const router = Router()
const productsController = require('../controllers/productsController')
const multer = require("multer");
const fs = require("fs");

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads')
        }
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('Invalid image type!');
        if (isValid) {
            uploadError = null
        }
        cb(uploadError, 'uploads')
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-').split('.')[0]
        const extension = FILE_TYPE_MAP[file.mimetype]
        cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
})
const uploadOptions = multer({ storage: storage })

router.get('/', productsController.getAllProducts)
router.get('/:id', productsController.getOneProduct)
router.post('/', uploadOptions.single('image'), productsController.createProduct)
router.put('/:id', productsController.updateProduct)
router.delete('/:id', productsController.deleteProduct)
router.get('/get/count', productsController.countProducts)
router.get('/get/featured/:limit', productsController.featuredProducts)
router.put('/gallery-images/:id', uploadOptions.array('images', 8), productsController.updateProductImages)

module.exports = router