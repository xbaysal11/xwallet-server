const IncomeCategory = require('../models/IncomeCategory');

// create income category
exports.create = async (req, res) => {
    try {
        const { name } = req.body;
        const incomeCategory = new IncomeCategory({
            name,
            owner: req.user.userId,
        });
        await incomeCategory.save();
        res.status(201).json(incomeCategory);
    } catch (e) {
        res.status(500).json({
            errors: e.message,
            message: 'Something is going wrong',
        });
    }
};

// get all income categories
exports.getAll = async (req, res) => {
    try {
        const incomeCategory = await IncomeCategory.find({
            owner: req.user.userId,
        });
        res.json(incomeCategory);
    } catch (e) {
        res.status(500).json({
            errors: e.message,
            message: 'Something is going wrong',
        });
    }
};
