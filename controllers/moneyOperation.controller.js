const MoneyOperation = require('../models/MoneyOperation');
const Wallet = require('../models/Wallet');
const Category = require('../models/Category');

exports.create = async (req, res) => {
  try {
    const { amount, comment, date, categoryId, walletId, type } = req.body;
    const category = await Category.findOne({
      owner: req.user.userId,
      _id: categoryId,
    });

    let walletModel;
    if (category.type === 1) {
      walletModel = await Wallet.findOneAndUpdate(
        { owner: req.user.userId, _id: walletId },
        { $inc: { balance: -amount } },
        { new: true }
      );
    } else if (category.type === 2) {
      walletModel = await Wallet.findOneAndUpdate(
        { owner: req.user.userId, _id: walletId },
        { $inc: { balance: amount } },
        { new: true }
      );
    }

    const MoneyOperationModel = new MoneyOperation({
      amount,
      comment,
      date,
      category: {
        categoryId,
        categoryName: category.name,
      },
      wallet: {
        walletId,
        walletName: walletModel.name,
      },
      owner: req.user.userId,
      type: category.type,
    });
    await MoneyOperationModel.save();

    let total = 0;
    const wallet = await Wallet.find({ owner: req.user.userId });
    wallet.map((item) => {
      total = total + item.balance;
    });
    res.status(201).json({ total, MoneyOperationModel });
  } catch (e) {
    res.status(500).json({
      errors: e.message,
      message: 'Something is going wrong',
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    let moneyOperation;
    if (req.query.type) {
      moneyOperation = await MoneyOperation.find({
        owner: req.user.userId,
        type: req.query.type,
      });
    } else {
      moneyOperation = await MoneyOperation.find({
        owner: req.user.userId,
      });
    }

    res.json(moneyOperation);
  } catch (e) {
    res.status(500).json({
      errors: e.message,
      message: 'Something is going wrong',
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const moneyOperation = await MoneyOperation.findById(req.params.id);
    res.json(moneyOperation);
  } catch (e) {
    res.status(500).json({
      errors: e.message,
      message: 'Something is going wrong',
    });
  }
};

exports.update = async (req, res) => {
  try {
    const moneyOperationPrev = await MoneyOperation.findById(req.params.id);
    if (req.body.amount) {
      if (req.body.amount >= moneyOperationPrev.amount) {
        let diff = req.body.amount - moneyOperationPrev.amount;
        if (moneyOperationPrev.type === 1) {
          await Wallet.findOneAndUpdate(
            { owner: req.user.userId, _id: moneyOperationPrev.wallet.walletId },
            { $inc: { balance: -diff } },
            { new: true }
          );
        } else if (moneyOperationPrev.type === 2) {
          await Wallet.findOneAndUpdate(
            { owner: req.user.userId, _id: moneyOperationPrev.wallet.walletId },
            { $inc: { balance: diff } },
            { new: true }
          );
        }
      } else {
        let diff = moneyOperationPrev.amount - req.body.amount;
        if (moneyOperationPrev.type === 1) {
          await Wallet.findOneAndUpdate(
            { owner: req.user.userId, _id: moneyOperationPrev.wallet.walletId },
            { $inc: { balance: diff } },
            { new: true }
          );
        } else if (moneyOperationPrev.type === 2) {
          await Wallet.findOneAndUpdate(
            { owner: req.user.userId, _id: moneyOperationPrev.wallet.walletId },
            { $inc: { balance: -diff } },
            { new: true }
          );
        }
      }
    }
    const moneyOperationNext = await MoneyOperation.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.json(moneyOperationNext);
  } catch (e) {
    res.status(500).json({
      errors: e.message,
      message: 'Something is going wrong',
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const moneyOperation = await MoneyOperation.findByIdAndRemove(
      req.params.id
    );
    if (moneyOperation.type === 1) {
      await Wallet.findOneAndUpdate(
        { owner: req.user.userId, _id: moneyOperation.wallet.walletId },
        { $inc: { balance: moneyOperation.amount } },
        { new: true }
      );
    } else if (moneyOperation.type === 2) {
      await Wallet.findOneAndUpdate(
        { owner: req.user.userId, _id: moneyOperation.wallet.walletId },
        { $inc: { balance: -moneyOperation.amount } },
        { new: true }
      );
    }

    console.log(moneyOperation);
    res.json({
      message: 'Money operation was deleted successfully!',
    });
  } catch (e) {
    res.status(500).json({
      errors: e.message,
      message: 'Something is going wrong',
    });
  }
};
