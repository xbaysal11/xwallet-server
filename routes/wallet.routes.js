const { Router } = require('express');
const auth = require('../middleware/auth.middleware');
const Wallet = require('../models/Wallet');
const router = Router();

// /api/wallet

router.post('/', auth, async (req, res) => {
    try {
        const { name, balance, type } = req.body;
        const wallet = new Wallet({
            name,
            balance,
            type,
            owner: req.user.userId,
        });
        await wallet.save();
        res.status(201).json(wallet);
    } catch (e) {
        res.status(500).json({
            errors: e.message,
            message: 'Something is going wrong',
        });
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const wallet = await Wallet.find({ owner: req.user.userId });
        res.json(wallet);
    } catch (e) {
        res.status(500).json({
            errors: e.message,
            message: 'Something is going wrong',
        });
    }
});


module.exports = router;
