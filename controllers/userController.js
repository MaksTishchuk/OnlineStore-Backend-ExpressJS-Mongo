const mongoose = require("mongoose");
const bcryptjs = require('bcryptjs')
const {User} = require('../models/user')
const jwt = require('jsonwebtoken')

const getAllUsers = async (req, res) => {
    try {
        const userList = await User.find().sort('-createdAt').select('-passwordHash')
        if (!userList) {
            return res.status(500).json({success: false, message: 'User List was not found!'})
        }
        res.status(200).json(userList)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

const getUser = async (req, res) => {
    try {
        const userId = req.params.id
        const user = await User.findById(userId).select('-passwordHash')
        if (!user) {
            return res.status(500).json({success: false, message: 'User was not found!'})
        }
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

const createUser = async (req, res) => {
    try {
        let user = new User({
            username: req.body.username,
            email: req.body.email,
            passwordHash: bcryptjs.hashSync(req.body.password, 10),
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country
        })
        user = await user.save()

        if (!user) {
            return res.status(500).json({success: false, message: 'User was not created!'})
        }
        res.json(user)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(404).json({success: false, message: 'User with this ID was not found!'})
        }
        const user = await User.findByIdAndUpdate(
            userId,
            {
                username: req.body.username,
                email: req.body.email,
                passwordHash: bcryptjs.hashSync(req.body.password, 10),
                phone: req.body.phone,
                isAdmin: req.body.isAdmin,
                street: req.body.street,
                apartment: req.body.apartment,
                zip: req.body.zip,
                city: req.body.city,
                country: req.body.country
            },
            {new: true}
        )
        if (!user) {
            return res.status(500).json({success: false, message: 'User was not found!'})
        }
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id
        User.findByIdAndDelete(userId, (err, doc) => {
            if (err) {
                console.log(err)
                return res.status(500).json({success: false, message: 'Something went wrong!'})
            }
            if (!doc) {
                return res.status(404).json({success: false, message: 'User was not found!'})
            }
            res.json({success: true, message: 'User was deleted!', doc: doc})
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

const loginUser = async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email})
        if (!user) {
            return res.status(400).json({success: false, message: 'User with this email or password was not found!'})
        }

        if (user && bcryptjs.compareSync(req.body.password, user.passwordHash)) {
            const token = jwt.sign(
                {
                    userId: user.id,
                    email: user.email,
                    isAdmin: user.isAdmin
                },
                process.env.jwtSecret,
                {
                    expiresIn: '24h'
                }
            )
            res.status(200).json({user: user.email, token: token})
        } else {
            return res.status(400).json({success: false, message: 'User with this email or password was not found!'})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

const registerUser = async (req, res) => {
    try {
        let user = new User({
            username: req.body.username,
            email: req.body.email,
            passwordHash: bcryptjs.hashSync(req.body.password, 10),
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country
        })
        user = await user.save()

        if (!user) {
            return res.status(500).json({success: false, message: 'User was not created!'})
        }
        res.json(user)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}

const countUsers = async (req, res) => {
    try {
        const userCount = await User.countDocuments()
        if (!userCount) {
            return res.status(500).json({success: false, message: 'Users was not counted!'})
        }
        res.status(200).json({userCount: userCount})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Something went wrong!', error: error.message})
    }
}


module.exports = {
    getAllUsers, getUser, createUser, updateUser, deleteUser, loginUser, registerUser, countUsers
}
