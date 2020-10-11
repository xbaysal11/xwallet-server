const Wallet = require('../models/Wallet');

// create wallet
exports.create = async (req, res) => {
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
};

// get all wallets
exports.getAll = async (req, res) => {
    try {
        const wallet = await Wallet.find({ owner: req.user.userId });
        res.json(wallet);
    } catch (e) {
        res.status(500).json({
            errors: e.message,
            message: 'Something is going wrong',
        });
    }
};
