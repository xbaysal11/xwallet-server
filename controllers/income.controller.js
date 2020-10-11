const Income = require('../models/Income');
const Wallet = require('../models/Wallet');
const IncomeCategory = require('../models/IncomeCategory');

// create income
exports.create = async (req, res) => {
    try {
        const { income, comment, categoryId, destinationId } = req.body;
        const incomeModel = new Income({
            income,
            comment,
            categoryId,
            destinationId,
            owner: req.user.userId,
        });
        await incomeModel.save();
        const wallet = await Wallet.findOneAndUpdate(
            { owner: req.user.userId, _id: destinationId },
            { $inc: { balance: income } },
            { new: true }
        );
        res.status(201).json(incomeModel);
    } catch (e) {
        res.status(500).json({
            errors: e.message,
            message: 'Something is going wrong',
        });
    }
};

// get all incomes
exports.getAll = async (req, res) => {
    try {
        const income = await Income.find({ owner: req.user.userId });
        // console.log(income.categoryId);
        // const categoryName = await IncomeCategory.findById({_id: income.categoryId})
        // res.format({
        //     'application/json': function () {
        //         res.json({income, categoryName: 1 });
        //     },
        // });
        res.json(income);
    } catch (e) {
        res.status(500).json({
            errors: e.message,
            message: 'Something is going wrong',
        });
    }
};
