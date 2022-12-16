const {Product} = require('../models/product')
const {Category} = require('../models/category')
const mongoose = require('mongoose')

const getAllProducts = async (req, res) => {
    try {
        let filter = {}
        if (req.query.categories) {
            filter = {category: req.query.categories.split(',')}
        }
        const productList = await Product.find(filter).sort('-dateCreated').populate('category') // можно использовать для вывода нужных полей (с минусом не выведутся): .select('name category -images')
        if (!productList) {
            return res.status(500).json({success: false, message: 'Product List was not found!'})
        }
        res.status(200).json(productList)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

const getOneProduct = async (req, res) => {
    try {
        const productId = req.params.id
        const product = await Product.findById(productId).populate('category')
        if (!product) {
            return res.status(500).json({success: false, message: 'Product was not found!'})
        }
        res.status(200).json(product)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

const createProduct = async (req, res) => {
    try {
        const category = await Category.findById(req.body.category)
        if (!category) {
            return res.status(500).json({success: false, message: 'Category for this product was not found!'})
        }

        const image = req.file;
        if (!image) return res.status(400).json({success: false, message: 'Image for this product was not found!'})

        const fileName = image.filename
        const basePath = `${req.protocol}://${req.get('host')}/uploads/`;

        let product = new Product({
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: `${basePath}${fileName}`,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured
        })
        product = await product.save()

        if (!product) {
            res.status(500).json({success: false, message: 'Product was not created!'})
        }

        res.json(product)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

const updateProduct = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(404).json({success: false, message: 'Product with this ID was not found!'})
        }
        const category = await Category.findById(req.body.category)
        if (!category) {
            return res.status(500).json({success: false, message: 'Category for this product was not found!'})
        }
        const productId = req.params.id
        const product = await Product.findByIdAndUpdate(
            productId,
            {
                name: req.body.name,
                description: req.body.description,
                richDescription: req.body.richDescription,
                image: req.body.image,
                brand: req.body.brand,
                price: req.body.price,
                category: req.body.category,
                countInStock: req.body.countInStock,
                rating: req.body.rating,
                numReviews: req.body.numReviews,
                isFeatured: req.body.isFeatured
            },
            {new: true}
        )
        if (!product) {
            return res.status(500).json({success: false, message: 'Product was not found!'})
        }
        res.status(200).json(product)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id
        Product.findByIdAndDelete(productId, (err, doc) => {
            if (err) {
                console.log(err)
                return res.status(500).json({success: false, message: 'Something went wrong!'})
            }
            if (!doc) {
                return res.status(404).json({success: false, message: 'Product was not found!'})
            }
            res.json({success: true,  message: 'Product was deleted!', doc: doc })
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

const countProducts = async (req, res) => {
    try {
        const productsCount = await Product.countDocuments()
        if (!productsCount) {
            return res.status(500).json({success: false, message: 'Products was not counted!'})
        }
        res.status(200).json({productsCount: productsCount})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

const featuredProducts = async (req, res) => {
    try {
        const limit = req.params.limit ? req.params.limit : 0
        const productsFeatured = await Product.find({isFeatured: true}).sort('-dateCreated').limit(+limit).populate('category')
        if (!productsFeatured) {
            return res.status(500).json({success: false, message: 'Featured products was not found!'})
        }
        res.status(200).json(productsFeatured)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

const updateProductImages = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(404).json({success: false, message: 'Product with this ID was not found!'})
        }
        const files = req.files
        let imagesPaths = [];
        const basePath = `${req.protocol}://${req.get('host')}/uploads/`;

        if (files) {
            files.map(file => {
                imagesPaths.push(`${basePath}${file.filename}`);
            })
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                images: imagesPaths
            },
            {new: true}
        )

        if (!product) {
            return res.status(500).json({success: false, message: 'Product was not found!'})
        }
        res.status(200).json(product)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

module.exports = {
    getAllProducts,
    getOneProduct,
    updateProduct,
    createProduct,
    deleteProduct,
    countProducts,
    featuredProducts,
    updateProductImages
}