const { Router } = require('express');
const auth = require('../middleware/auth.middleware');
const Transfer = require('../models/Transfer');
const Wallet = require('../models/Wallet');
const router = Router();

// /api/transfer

router.post('/', auth, async (req, res) => {
    try {
        const { amount, comment, resourceId, destinationId } = req.body;
        const transfer = new Transfer({
            amount,
            comment,
            resourceId,
            destinationId,
            owner: req.user.userId,
        });
        await transfer.save();

        const resource = await Wallet.findOneAndUpdate(
            { owner: req.user.userId, _id: resourceId },
            { $inc: { balance: -amount } },
            { new: true }
        );
        const destination = await Wallet.findOneAndUpdate(
            { owner: req.user.userId, _id: destinationId },
            { $inc: { balance: amount } },
            { new: true }
        );

        res.status(201).json(transfer);
    } catch (e) {
        res.status(500).json({
            errors: e.message,
            message: 'Something is going wrong',
        });
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const transfer = await Transfer.find({ owner: req.user.userId });
        res.json(transfer);
    } catch (e) {
        res.status(500).json({
            errors: e.message,
            message: 'Something is going wrong',
        });
    }
});

module.exports = router;