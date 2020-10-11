const ExpenseCategory = require('../models/ExpenseCategory');

// create expense category
exports.create = async (req, res) => {
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
};

// get all expense categories
exports.getAll = async (req, res) => {
    try {
        const expenseCategory = await ExpenseCategory.find({
            owner: req.user.userId,
        });
        res.json(expenseCategory);
    } catch (e) {
        res.status(500).json({
            errors: e.message,
            message: 'Something is going wrong',
        });
    }
};
