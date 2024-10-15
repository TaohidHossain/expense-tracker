const express = require('express')
const { authController, expenseController } = require('../../Controllers')

const router = express.Router()

router.route('/')
    .get(authController.protect, expenseController.getExpenses)
    .post(authController.protect, expenseController.createExpense)

router.route('/:id')
    .get(authController.protect, expenseController.getExpense)
    .patch(authController.protect, expenseController.updateExpense)
    .delete(authController.protect, expenseController.deleteExpense)

module.exports = router