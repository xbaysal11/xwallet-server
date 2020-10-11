const Expense = require('../models/Expense');
const Wallet = require('../models/Wallet');

// create expense
exports.create = async (req, res) => {
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
        const wallet = await Wallet.findOneAndUpdate(
            { owner: req.user.userId, _id: resourceId },
            { $inc: { balance: -expense } },
            { new: true }
        );

        res.status(201).json(expenseModel);
    } catch (e) {
        res.status(500).json({
            errors: e.message,
            message: 'Something is going wrong',
        });
    }
};

// get all expenses
exports.getAll = async (req, res) => {
    try {
        const expense = await Expense.find({ owner: req.user.userId });
        res.json(expense);
    } catch (e) {
        res.status(500).json({
            errors: e.message,
            message: 'Something is going wrong',
        });
    }
};
