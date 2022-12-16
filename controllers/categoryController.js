const mongoose = require("mongoose");
const {Category} = require('../models/category')

const getAllCategories = async (req, res) => {
    try {
        const categoryList = await Category.find().sort('name')
        if (!categoryList) {
            return res.status(500).json({success: false, message: 'Category List was not found!'})
        }
        res.status(200).json(categoryList)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

const getOneCategory = async (req, res) => {
    try {
        const categoryId = req.params.id
        const category = await Category.findById(categoryId)
        if (!category) {
            return res.status(500).json({success: false, message: 'Category was not found!'})
        }
        res.status(200).json(category)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

const createCategory = async (req, res) => {
    try {
        let category = new Category({
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color
        })
        category = await category.save()

        if (!category) {
            return res.status(500).json({success: false, message: 'Category was not created!'})
        }
        res.json(category)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

const updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id
        if (!mongoose.isValidObjectId(categoryId)) {
            return res.status(404).json({success: false, message: 'Category with this ID was not found!'})
        }
        const category = await Category.findByIdAndUpdate(
            categoryId,
            {
                name: req.body.name,
                icon: req.body.icon,
                color: req.body.color
            },
            {new: true} // Вывести обновленную категорию, а не ту, что до обновления
        )
        if (!category) {
            return res.status(500).json({success: false, message: 'Category was not found!'})
        }
        res.status(200).json(category)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id
        Category.findByIdAndDelete(categoryId, (err, doc) => {
            if (err) {
                console.log(err)
                return res.status(500).json({success: false, message: 'Something went wrong!'})
            }
            if (!doc) {
                return res.status(404).json({success: false, message: 'Category was not found!'})
            }
            res.json({success: true,  message: 'Category was deleted!', doc: doc })
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

module.exports = { getAllCategories, getOneCategory, updateCategory, createCategory, deleteCategory }