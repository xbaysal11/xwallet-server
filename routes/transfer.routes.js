const { Router } = require('express');
const auth = require('../middleware/auth.middleware');
const Transfer = require('../models/Transfer');
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
