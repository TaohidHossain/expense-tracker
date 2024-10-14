const express = require('express')
const { connectDB } = require('./Config')
const { PORT } = require('./Config/serverConfig')
const { globalErrorHandler } = require('./Utils')
// Setup express app
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// API routes

// Connect DB and run the app
connectDB()
    .then(conn =>{
        console.log("Database connected successfully.")
        const server = app.listen(PORT, () => {
            console.log(`App is listening at port ${PORT}`)
        })
    })
    .catch(error => {
        console.log(error)
        console.log(error.errorResponse.errmsg)
    })


app.get('/', (req, res) => {
    res.status(200).json({
        'status': 'success'
    })
})
app.use(globalErrorHandler)
