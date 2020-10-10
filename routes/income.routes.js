const { Router } = require('express');
const auth = require('../middleware/auth.middleware');
const Income = require('../models/Income');
const router = Router();

// /api/income

router.post('/', auth, async (req, res) => {
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
        res.status(201).json(incomeModel);
    } catch (e) {
        res.status(500).json({
            errors: e.message,
            message: 'Something is going wrong',
        });
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const income = await Income.find({ owner: req.user.userId });
        res.json(income);
    } catch (e) {
        res.status(500).json({
            errors: e.message,
            message: 'Something is going wrong',
        });
    }
});

module.exports = router;
