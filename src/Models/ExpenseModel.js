const mongoose = require('mongoose')


const expenseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Expense title is required"]
        },
        amount: {
            type: Number,
            required: [true, "Expense amount is required"]
        },
        userId: {
            type: String,   
        }
    },
    {
        timestamps: true
    }
)
// TODO: set default userID from JWT token

const Expense = mongoose.model('expense', expenseSchema)

module.exports = Expense