const Expense = require('../models/Expense');
const Wallet = require('../models/Wallet');
const ExpenseCategory = require('../models/ExpenseCategory');

// create expense
exports.create = async (req, res) => {
    try {
        const { expense, comment, categoryId, resourceId } = req.body;
        const expenseCategory = await ExpenseCategory.findOne({
            owner: req.user.userId,
            _id: categoryId,
        });

        const walletModel = await Wallet.findOneAndUpdate(
            { owner: req.user.userId, _id: resourceId },
            { $inc: { balance: -expense } },
            { new: true }
        );
        const expenseModel = new Expense({
            expense,
            comment,
            categoryId,
            categoryName: expenseCategory.name,
            resourceId,
            resourceName: walletModel.name,
            owner: req.user.userId,
        });
        await expenseModel.save();


        let total = 0;
        const wallet = await Wallet.find({ owner: req.user.userId });
        await wallet.map((item) => {
            total = total + item.balance;
        });
        res.status(201).json({ total, expenseModel });
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
