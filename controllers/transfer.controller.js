const Transfer = require('../models/Transfer');
const Wallet = require('../models/Wallet');

// create transfer
exports.create = async (req, res) => {
    try {
        const { amount, comment, resourceId, destinationId } = req.body;

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
        const transfer = new Transfer({
            amount,
            comment,
            resourceId,
            resourceName: resource.name,
            destinationId,
            destinationName: destination.name,
            owner: req.user.userId,
        });
        await transfer.save();


        let total = 0;
        const wallet = await Wallet.find({ owner: req.user.userId });
        await wallet.map((item) => {
            total = total + item.balance;
        });
        res.status(201).json({ total, transfer });
    } catch (e) {
        res.status(500).json({
            errors: e.message,
            message: 'Something is going wrong',
        });
    }
};

// get all transfers
exports.getAll = async (req, res) => {
    try {
        const transfer = await Transfer.find({ owner: req.user.userId });
        res.json(transfer);
    } catch (e) {
        res.status(500).json({
            errors: e.message,
            message: 'Something is going wrong',
        });
    }
};
