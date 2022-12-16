require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const router = require('./routes/index')
const checkAuth = require('./middlewares/authMiddleware')
const errorHandler = require('./middlewares/errorHandlerMiddleware')

const server = express()
const PORT = process.env.PORT || 3000

server.use(bodyParser.json())
server.use(express.urlencoded({extended: true}))
server.use(morgan('tiny'))
server.use(cors())
server.options('*', cors)
server.use(checkAuth())
server.use('/uploads', express.static(__dirname + '/uploads'))
server.use(errorHandler)

// Routers
server.use(`${process.env.API_URL}`, router)

async function start() {
    try {
        mongoose.set("strictQuery", false)
        await mongoose.connect(process.env.mongoURI)
            .then(() => {
                console.log('Database has been connected!')
            })
            .catch((err) => {
                console.log(err)
            })
        server.listen(PORT, () => {
            console.log(`Server has been started on port ${PORT}`)
        })
    } catch (error) {
        console.log('Server Error', error.message)
        process.exit(1)
    }
}

start()
