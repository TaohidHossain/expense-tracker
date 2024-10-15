const { Expense } = require('../Models')
const { asyncErrorHandler, CustomError } = require('../Utils')

const getExpenses = asyncErrorHandler( async (req, res, next) => {
    let queryObj = { ...req.query }
    queryObj['userId'] = req.user._id
    // Pagination logic
    let page = req.query.page ? req.query.page : 1 // By default show first page
    let limit = req.query.limit ? req.query.limit : 10 // By default limit to 10 expenses
    let skip = (page - 1) * limit
    // Sorting and Selecting fields logic
    let sort = req.query.sort ? req.query.sort.split(',').join(' ') :  '-createdAt'
    let fields = req.query.fields ? req.query.fields.split(',').join(' ') : '-__v'
    
    delete queryObj['page']
    delete queryObj['limit']
    delete queryObj['sort']
    delete queryObj['fields']

    let query = Expense.find(queryObj)
    const expenses = await query.sort(sort).skip(skip).limit(limit).select(fields)
    return res.status(200).json({
        "status": "success",
        "data": expenses
    })
})

const getExpense = asyncErrorHandler( async (req, res, next) => {
    const id = req.params.id
    const userId = req.user._id
    let fields = req.query.fields ? req.query.fields.split(',').join(' ') : '-__v'
    fields += req.query.fields ? ' userId' : ''
    const expense = await Expense.findById(id).select(fields).select('+userId')
    if(expense.userId != userId){
        const error = new CustomError("You do not have permission for this record", 403)
        return next(error)
    }
    return res.status(200).json({
        "status": "success",
        "data": expense
    })
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
    const id = req.params.id
    const userId = req.user._id
    const expense = await Expense.findById(id)
    if(!expense){
        const error = new CustomError("Data not found", 404)
        return next(error)
    }
    if(expense.userId != userId){
        const error = new CustomError("You do not have permission for this record", 403)
        return next(error)
    }
    await Expense.findByIdAndDelete(id)
    return res.status(204).json({
        "status": "success"
    })
})

const updateExpense = asyncErrorHandler( async (req, res, next) => {
    const id = req.params.id
    const userId = req.user._id
    const expense = await Expense.findById(id)
    if(!expense){
        const error = new CustomError("Data not found", 404)
        return next(error)
    }
    if(expense.userId != userId){
        const error = new CustomError("You do not have permission for this record", 403)
        return next(error)
    }
    const updatedExpense = await Expense.findByIdAndUpdate(id, req.body, {new: true, runValidators: true})
    return res.status(200).json({
        "status": "success",
        "data": updatedExpense
    })
})

module.exports = {
    getExpenses,
    getExpense,
    createExpense,
    deleteExpense,
    updateExpense
}