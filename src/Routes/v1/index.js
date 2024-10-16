const { Router } = require('express')
const authRouter = require('./authRouter')
const expenseRouter = require('./expenseRouter')

const v1Router = Router()

v1Router.use('/v1', authRouter)
v1Router.use('/v1/expenses', expenseRouter)

module.exports = v1Router