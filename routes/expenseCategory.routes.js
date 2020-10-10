const { Router } = require('express');
const auth = require('../middleware/auth.middleware');
const ExpenseCategory = require('../models/ExpenseCategory');
const router = Router();

// /api/expense-category

router.post('/', auth, async (req, res) => {
    try {
        const { name } = req.body;
        const expenseCategory = new ExpenseCategory({
            name,
            owner: req.user.userId,
        });
        await expenseCategory.save();
        res.status(201).json(expenseCategory);
    } catch (e) {
        res.status(500).json({
            errors: e.message,
            message: 'Something is going wrong',
        });
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const expenseCategory = await ExpenseCategory.find({ owner: req.user.userId });
        res.json(expenseCategory);
    } catch (e) {
        res.status(500).json({
            errors: e.message,
            message: 'Something is going wrong',
        });
    }
});


module.exports = router;
