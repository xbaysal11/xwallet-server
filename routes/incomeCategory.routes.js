const { Router } = require('express');
const auth = require('../middleware/auth.middleware');
const IncomeCategory = require('../models/IncomeCategory');
const router = Router();

// /api/income-category

router.post('/', auth, async (req, res) => {
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
});

router.get('/', auth, async (req, res) => {
    try {
        const incomeCategory = await IncomeCategory.find({ owner: req.user.userId });
        res.json(incomeCategory);
    } catch (e) {
        res.status(500).json({
            errors: e.message,
            message: 'Something is going wrong',
        });
    }
});


module.exports = router;
