const express = require('express')
const { authController, expenseController } = require('../../Controllers')

const router = express.Router()

router.route('/')
    .get(authController.protect, expenseController.getExpenses)
    .post(authController.protect, expenseController.createExpense)

module.exports = router