const express = require('express')
const { connectDB } = require('./Config')
const { PORT } = require('./Config/serverConfig')
const { globalErrorHandler } = require('./Utils')
const v1Router = require('./Routes')
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

app.use('/api/v1/', v1Router.authRouter)
app.use('/api/v1/expenses', v1Router.expenseRouter)

app.get('/', (req, res) => {
    res.status(200).json({
        'status': 'success'
    })
})

app.all('*', (req, res) => {
    res.status(404).json({
        'status': 'success',
        'message': 'This route does not exist'
    })
})
app.use(globalErrorHandler)
