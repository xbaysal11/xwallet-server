const { Router } = require('express');
const auth = require('../middleware/auth.middleware');
const Expense = require('../models/Expense');
const router = Router();

// /api/expense

router.post('/', auth, async (req, res) => {
    try {
        const { expense, comment, categoryId, resourceId } = req.body;
        const expenseModel = new Expense({
            expense,
            comment,
            categoryId,
            resourceId,
            owner: req.user.userId,
        });
        await expenseModel.save();
        res.status(201).json(expenseModel);
    } catch (e) {
        res.status(500).json({
            errors: e.message,
            message: 'Something is going wrong',
        });
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const expense = await Expense.find({ owner: req.user.userId });
        res.json(expense);
    } catch (e) {
        res.status(500).json({
            errors: e.message,
            message: 'Something is going wrong',
        });
    }
});

module.exports = router;
