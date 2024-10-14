const express = require('express')
const { connectDB } = require('./Config')
const { PORT } = require('./Config/serverConfig')
// Setup express app
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// API routes

// Connect DB and run the app
app.listen(PORT, async ()=>{
    await connectDB()
    console.log("Database connected successfully")
    console.log(`App is listening at port ${PORT}`)
})


app.get('/', (req, res) => {
    res.status(200).json({
        'status': 'success'
    })
})
