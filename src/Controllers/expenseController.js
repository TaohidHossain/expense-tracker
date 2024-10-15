const { Expense } = require('../Models')
const { asyncErrorHandler } = require('../Utils')

const getExpenses = asyncErrorHandler( async (req, res, next) => {
    
})

const getExpense = asyncErrorHandler( async (req, res, next) => {
    
})

const createExpense = asyncErrorHandler( async (req, res, next) => {
    let modelBody = {...req.body}
    modelBody['userId'] = req.user.id
    const newExpense = await Expense.create(modelBody)
    return res.status(201).json({
        "status": "success",
        "data": newExpense
    })
})

const deleteExpense = asyncErrorHandler( async (req, res, next) => {
    
})

const updateExpense = asyncErrorHandler( async (req, res, next) => {
    
})



module.exports = {
    getExpenses,
    getExpense,
    createExpense,
    deleteExpense,
    updateExpense
}